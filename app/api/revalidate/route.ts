import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

/**
 * Cron 갱신 엔드포인트
 * - 매일 자정에 cron-job.org가 GET으로 호출
 * - 쿼리 파라미터 ?token=... 으로 인증
 */
export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');
    const expected = process.env.REVALIDATE_TOKEN;

    if (!expected || token !== expected) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 페이지 전체 + API 라우트 캐시 무효화
        revalidatePath('/');
        revalidatePath('/api/kmong');
        revalidatePath('/api/ga');
        revalidatePath('/api/naver');

        return NextResponse.json({
            revalidated: true,
            at: new Date().toISOString(),
        });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : '알 수 없는 에러' },
            { status: 500 }
        );
    }
}