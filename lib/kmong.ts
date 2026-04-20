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

    const recentReviews: KmongReview[] = [];

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