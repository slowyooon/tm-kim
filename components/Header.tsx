export default function Header() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'long',
    });
    const timeStr = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    return (
        <header className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
            <h1 className="text-[22px] font-medium m-0">끝판왕KIM · 통합 대시보드</h1>
            <div className="text-[13px] text-neutral-500">
                <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-blue" />
                    v0.1 · {dateStr} · LIVE {timeStr}
                </span>
            </div>
        </header>
    );
}