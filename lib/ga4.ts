import { BetaAnalyticsDataClient } from '@google-analytics/data';

export interface GA4Metrics {
    totalUsers: number;
    pageViews: number;
    returningUsers: number;      // ← 세션 → 재방문자로 교체
    avgSessionDurationSec: number;
    range: string;
    fetchedAt: string;
}

/**
 * GA4 Data API 클라이언트 초기화
 */
function getClient(): BetaAnalyticsDataClient {
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!credentialsJson) {
        throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON 환경변수가 없어');
    }

    const credentials = JSON.parse(credentialsJson);
    return new BetaAnalyticsDataClient({ credentials });
}

/**
 * GA4 지표 가져오기
 * - totalUsers: 전체 방문자
 * - pageViews: 페이지뷰
 * - returningUsers: 재방문자 (newVsReturning == 'returning')
 * - avgSessionDurationSec: 평균 체류 시간(초)
 */
export async function fetchGA4Metrics(days: number = 7): Promise<GA4Metrics> {
    const propertyId = process.env.GA4_PROPERTY_ID;
    if (!propertyId) {
        throw new Error('GA4_PROPERTY_ID 환경변수가 없어');
    }

    const client = getClient();

    // 전체 지표 (방문자·페이지뷰·평균 체류)
    const [mainResponse] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        metrics: [
            { name: 'totalUsers' },
            { name: 'screenPageViews' },
            { name: 'averageSessionDuration' },
        ],
    });

    const mainRow = mainResponse.rows?.[0];
    const mainValues = mainRow?.metricValues ?? [];

    // 재방문자 추출: newVsReturning 차원으로 분리해서 'returning'만 합산
    const [returningResponse] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        dimensions: [{ name: 'newVsReturning' }],
        metrics: [{ name: 'totalUsers' }],
    });

    let returningUsers = 0;
    for (const row of returningResponse.rows ?? []) {
        const type = row.dimensionValues?.[0]?.value;
        const count = parseInt(row.metricValues?.[0]?.value ?? '0', 10);
        if (type === 'returning') {
            returningUsers += count;
        }
    }

    return {
        totalUsers: parseInt(mainValues[0]?.value ?? '0', 10),
        pageViews: parseInt(mainValues[1]?.value ?? '0', 10),
        returningUsers,
        avgSessionDurationSec: Math.round(parseFloat(mainValues[2]?.value ?? '0')),
        range: `지난 ${days}일`,
        fetchedAt: new Date().toISOString(),
    };
}