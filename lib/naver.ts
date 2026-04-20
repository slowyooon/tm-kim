export interface TrendKeyword {
    category: string;
    keyword: string;
    weeklyChange: number; // %
}

// 키워드 → 카테고리 매핑
const KEYWORD_CATEGORIES: Record<string, string> = {
    '전자책': '전자책',
    '블로그': '블로그',
    '애드센스': '블로그',
    'N잡': 'N잡',
    '자기계발': '습관',
    '크몽': 'N잡',
    '티스토리': '블로그',
    '디지털 노마드': 'N잡',
    'AI 수익': 'AI',
    '수익형 블로그': '블로그',
};

/**
 * 네이버 데이터랩으로 키워드별 주간 변동률 가져오기
 * - 지난 주 대비 이번 주 검색량 변화 %
 * - 네이버는 절대 검색량이 아닌 상대값(0~100)만 제공
 */
export async function fetchKeywordTrends(): Promise<TrendKeyword[]> {
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;
    const keywordsEnv = process.env.NAVER_KEYWORDS || '';

    if (!clientId || !clientSecret) {
        throw new Error('네이버 API 키가 없어');
    }

    const keywords = keywordsEnv.split(',').map((k) => k.trim()).filter(Boolean);
    if (keywords.length === 0) return [];

    // 날짜 계산: 지난 2주
    const today = new Date();
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 14);
    const startDate = twoWeeksAgo.toISOString().slice(0, 10);
    const endDate = today.toISOString().slice(0, 10);

    // 네이버 데이터랩은 한 번에 5개씩 처리. 그룹 나눠서 호출.
    const chunks: string[][] = [];
    for (let i = 0; i < keywords.length; i += 5) {
        chunks.push(keywords.slice(i, i + 5));
    }

    const results: TrendKeyword[] = [];

    for (const chunk of chunks) {
        const body = {
            startDate,
            endDate,
            timeUnit: 'week',
            keywordGroups: chunk.map((kw) => ({
                groupName: kw,
                keywords: [kw],
            })),
        };

        const response = await fetch('https://openapi.naver.com/v1/datalab/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Naver-Client-Id': clientId,
                'X-Naver-Client-Secret': clientSecret,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`네이버 API 에러: ${response.status}`);
        }

        const data = await response.json();

        for (const item of data.results || []) {
            const keyword = item.title;
            const dataPoints = item.data || [];

            if (dataPoints.length < 2) {
                results.push({
                    category: KEYWORD_CATEGORIES[keyword] || '기타',
                    keyword,
                    weeklyChange: 0,
                });
                continue;
            }

            // 마지막 주 vs 그 전 주
            const thisWeek = dataPoints[dataPoints.length - 1].ratio;
            const lastWeek = dataPoints[dataPoints.length - 2].ratio;

            const change = lastWeek === 0 ? 0 : Math.round(((thisWeek - lastWeek) / lastWeek) * 100);

            results.push({
                category: KEYWORD_CATEGORIES[keyword] || '기타',
                keyword,
                weeklyChange: change,
            });
        }
    }

    // 변동률 큰 순으로 정렬
    results.sort((a, b) => Math.abs(b.weeklyChange) - Math.abs(a.weeklyChange));

    return results;
}
