import { NextResponse } from 'next/server';
import { fetchKmongProduct, parseKmongEntry } from '@/lib/kmong';

export const revalidate = 21600;

export async function GET() {
    const urlsEnv = process.env.KMONG_URLS || '';
    const entries = urlsEnv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    if (entries.length === 0) {
        return NextResponse.json(
            { error: '.env.local에 KMONG_URLS가 비어있어' },
            { status: 400 }
        );
    }

    try {
        const products = await Promise.all(
            entries.map(async (entry) => {
                const { url, priceMin, priceMax } = parseKmongEntry(entry);
                try {
                    return await fetchKmongProduct(url, priceMin, priceMax);
                } catch (err) {
                    return {
                        url,
                        error: err instanceof Error ? err.message : '알 수 없는 에러',
                    };
                }
            })
        );

        return NextResponse.json({
            count: products.length,
            products,
            fetchedAt: new Date().toISOString(),
        });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : '전체 실패' },
            { status: 500 }
        );
    }
}