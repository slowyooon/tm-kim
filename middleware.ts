import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const expectedUser = process.env.DASHBOARD_USER;
    const expectedPassword = process.env.DASHBOARD_PASSWORD;

    // 환경변수 안 설정하면 보호 안 됨 (로컬 개발 편의)
    if (!expectedUser || !expectedPassword) {
        return NextResponse.next();
    }

    const basicAuth = request.headers.get('authorization');
    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':');
        if (user === expectedUser && pwd === expectedPassword) {
            return NextResponse.next();
        }
    }

    return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="TM-KIM Dashboard"' },
    });
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api/revalidate).*)'],
};