import axios from 'axios';
import * as cheerio from 'cheerio';

export interface KmongReview {
    rating: number;
    nickname: string;
    content: string;
}

export interface KmongProduct {
    url: string;
    gigId: string;
    title: string;
    rating: number | null;
    reviewCount: number | null;
    priceMin: number | null;
    priceMax: number | null;
    satisfactionRate: number | null;
    recentReviews: KmongReview[];
    fetchedAt: string;
}

/**
 * env에서 "URL|가격범위" 형식 파싱
 * 예: "https://kmong.com/gig/123|66000-136000" → { url, priceMin: 66000, priceMax: 136000 }
 */
export function parseKmongEntry(entry: string): {
    url: string;
    priceMin: number | null;
    priceMax: number | null;
} {
    const [url, priceStr] = entry.split('|').map((s) => s.trim());
    if (!priceStr) {
        return { url, priceMin: null, priceMax: null };
    }
    if (priceStr.includes('-')) {
        const [min, max] = priceStr.split('-').map((s) => parseInt(s.trim(), 10));
        return { url, priceMin: min, priceMax: max };
    }
    const single = parseInt(priceStr, 10);
    return { url, priceMin: single, priceMax: single };
}

export async function fetchKmongProduct(
    url: string,
    priceMin: number | null = null,
    priceMax: number | null = null
): Promise<KmongProduct> {
    const response = await axios.get(url, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        },
        timeout: 15000,
    });

    const html = response.data as string;
    const $ = cheerio.load(html);
    const bodyText = $('body').text();

    // gigId
    const gigIdMatch = url.match(/\/gig\/(\d+)/);
    const gigId = gigIdMatch ? gigIdMatch[1] : '';

    // 제목
    let title = $('h1').first().text().trim();
    if (!title) {
        title = $('title').text().replace(/- 크몽\s*$/, '').trim();
    }

    // 평점·리뷰수
    const ratingMatch = bodyText.match(/(\d\.\d?)\s*\(([\d,]+)\)/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
    const reviewCount = ratingMatch
        ? parseInt(ratingMatch[2].replace(/,/g, ''), 10)
        : null;

    // 만족도
    const satMatch = bodyText.match(/만족도[^\d]*(\d+)\s*%/);
    const satisfactionRate = satMatch ? parseInt(satMatch[1], 10) : null;

    // 리뷰 수집
    // 크몽 페이지는 CSS가 본문에 섞여 있어서, "고객들의 리뷰를 요약했어요" 이후부터 찾음
    const recentReviews: KmongReview[] = [];

    // 리뷰 섹션 경계 잡기
    const reviewStartMatch = bodyText.match(/고객들의\s*리뷰를\s*요약했어요/);
    const reviewEndMatch = bodyText.match(/(?:책소개|목차|서비스\s*설명|가격\s*정보|전문가\s*정보|취소\s*및\s*환불|상품정보고시)/);

    if (reviewStartMatch && reviewStartMatch.index !== undefined) {
        const startIdx = reviewStartMatch.index + reviewStartMatch[0].length;
        const endIdx =
            reviewEndMatch && reviewEndMatch.index !== undefined && reviewEndMatch.index > startIdx
                ? reviewEndMatch.index
                : bodyText.length;
        const reviewSection = bodyText.slice(startIdx, endIdx);

        // 패턴: 5.0닉네임*****본문 (다음 평점 등장 전까지가 한 리뷰)
        // 평점은 1.0, 2.3, 5, 5.0 등 다양한 형태 허용
        const reviewPattern = /(\d(?:\.\d)?)([가-힣a-zA-Z0-9]{1,20}\*{3,})([\s\S]*?)(?=\d(?:\.\d)?[가-힣a-zA-Z0-9]{1,20}\*{3,}|$)/g;

        let match;
        let count = 0;
        while ((match = reviewPattern.exec(reviewSection)) !== null && count < 8) {
            const rating = parseFloat(match[1]);
            const nickname = match[2].trim();
            const content = match[3].trim().replace(/\s+/g, ' ').slice(0, 300);

            // 유효성: 평점 0~5, 내용 최소 5자 이상, 내용에 CSS 같은 노이즈 없음
            const hasNoise = /\{|\}|css-|webkit|display:|content:|transform:/i.test(content);
            if (rating >= 0 && rating <= 5 && content.length >= 5 && !hasNoise) {
                recentReviews.push({ rating, nickname, content });
                count++;
            }
        }
    }

    return {
        url,
        gigId,
        title,
        rating,
        reviewCount,
        priceMin,
        priceMax,
        satisfactionRate,
        recentReviews,
        fetchedAt: new Date().toISOString(),
    };
}