import { NextResponse } from 'next/server';
import { fetchKeywordTrends } from '@/lib/naver';

export const revalidate = 21600;

export async function GET() {
    try {
        const keywords = await fetchKeywordTrends();
        return NextResponse.json({ count: keywords.length, keywords });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : '알 수 없는 에러' },
            { status: 500 }
        );
    }
}