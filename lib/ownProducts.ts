import { BetaAnalyticsDataClient } from '@google-analytics/data';

export interface OwnProduct {
    url: string;
    path: string;              // 예: "/blogmoney"
    name: string;              // 예: "구글애드센스 블로그 노하우"
    priceList: number;         // 정가
    discountPercent: number;   // 할인율 (%)
    priceSale: number;         // 실제 판매가
    pageViews: number;         // GA4에서 가져옴
    avgTimeSec: number;        // 평균 체류
    fetchedAt: string;
}

// URL → 사람이 읽을 수 있는 이름 매핑
const PRODUCT_NAMES: Record<string, string> = {
    '/blogmoney': '구글애드센스 블로그 노하우',
    '/makingbookmoney': '전자책 제작 노하우',
    '/habitstudy': '무의식 활용법',
};

/**
 * .env에서 "URL|정가|할인율" 형식 파싱
 */
function parseOwnEntry(entry: string): {
    url: string;
    path: string;
    priceList: number;
    discountPercent: number;
    priceSale: number;
} {
    const [url, priceStr, discountStr] = entry.split('|').map((s) => s.trim());
    const priceList = parseInt(priceStr, 10);
    const discountPercent = parseInt(discountStr, 10) || 0;
    const priceSale = Math.round(priceList * (1 - discountPercent / 100));

    // URL에서 path 추출
    const pathMatch = url.match(/betterlifehere\.com(\/[^?#]*)/);
    const path = pathMatch ? pathMatch[1] : '';

    return { url, path, priceList, discountPercent, priceSale };
}

/**
 * GA4에서 상품 페이지별 지표 가져오기
 */
async function fetchPagePerformance(
    paths: string[],
    days: number = 7
): Promise<Record<string, { pageViews: number; avgTimeSec: number }>> {
    const propertyId = process.env.GA4_PROPERTY_ID;
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

    if (!propertyId || !credentialsJson) {
        // GA4 미설정 시 빈 결과
        return {};
    }

    const client = new BetaAnalyticsDataClient({
        credentials: JSON.parse(credentialsJson),
    });

    const [response] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
            { name: 'screenPageViews' },
            { name: 'averageSessionDuration' },
        ],
    });

    const result: Record<string, { pageViews: number; avgTimeSec: number }> = {};
    for (const row of response.rows ?? []) {
        const path = row.dimensionValues?.[0]?.value ?? '';
        if (paths.includes(path)) {
            result[path] = {
                pageViews: parseInt(row.metricValues?.[0]?.value ?? '0', 10),
                avgTimeSec: Math.round(parseFloat(row.metricValues?.[1]?.value ?? '0')),
            };
        }
    }

    return result;
}

/**
 * 자체몰 상품 목록과 성과 지표 합쳐서 리턴
 */
export async function fetchOwnProducts(days: number = 7): Promise<OwnProduct[]> {
    const entriesEnv = process.env.OWN_PRODUCTS || '';
    const entries = entriesEnv.split(',').map((s) => s.trim()).filter(Boolean);

    if (entries.length === 0) return [];

    const parsed = entries.map(parseOwnEntry);
    const paths = parsed.map((p) => p.path);

    // GA4 데이터 한 번에 조회
    let perfMap: Record<string, { pageViews: number; avgTimeSec: number }> = {};
    try {
        perfMap = await fetchPagePerformance(paths, days);
    } catch (err) {
        console.error('GA4 product fetch error:', err);
    }

    return parsed.map((p) => {
        const perf = perfMap[p.path] ?? { pageViews: 0, avgTimeSec: 0 };
        return {
            ...p,
            name: PRODUCT_NAMES[p.path] ?? p.path,
            pageViews: perf.pageViews,
            avgTimeSec: perf.avgTimeSec,
            fetchedAt: new Date().toISOString(),
        };
    });
}