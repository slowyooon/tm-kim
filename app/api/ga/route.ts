import { NextResponse } from 'next/server';
import { fetchGA4Metrics } from '@/lib/ga4';

// 6시간 캐시
export const revalidate = 21600;

export async function GET() {
    try {
        const metrics = await fetchGA4Metrics(7);
        return NextResponse.json(metrics);
    } catch (err) {
        return NextResponse.json(
            {
                error: err instanceof Error ? err.message : '알 수 없는 에러',
            },
            { status: 500 }
        );
    }
}