import type { GA4Metrics } from '@/lib/ga4';

function formatNumber(n: number): string {
    return n.toLocaleString('ko-KR');
}

function formatDuration(sec: number): string {
    if (sec < 60) return `${sec}초`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}분 ${s}초`;
}

export default function KpiCards({ metrics }: { metrics: GA4Metrics | null }) {
    // 데이터가 없거나 에러 시 플레이스홀더
    if (!metrics) {
        return (
            <div className="bg-[#0A1628] border border-[#1E3A8A] rounded-xl p-7 mb-8 text-center text-[#B5D4F4]">
                <div className="text-[11px] uppercase tracking-widest mb-2 font-medium text-[#85B7EB]">
                    KPI · GA4
                </div>
                <div className="text-[15px] font-medium mb-1">
                    데이터를 불러올 수 없어
                </div>
                <div className="text-[13px] opacity-70">
                    GA4 연결을 확인해줘
                </div>
            </div>
        );
    }

    const items = [
        { label: '방문자', value: formatNumber(metrics.totalUsers), unit: '명' },
        { label: '페이지뷰', value: formatNumber(metrics.pageViews), unit: '회' },
        { label: '재방문자', value: formatNumber(metrics.returningUsers), unit: '명' },
        { label: '평균 체류', value: formatDuration(metrics.avgSessionDurationSec), unit: '' },
    ];

    return (
        <section className="mb-8">
            <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-[18px] font-medium">
                    KPI
                    <span className="text-[13px] text-neutral-500 font-normal ml-2">
                        {metrics.range} · 자체몰
                    </span>
                </h2>
            </div>
            <div className="bg-[#0A1628] border border-[#1E3A8A] rounded-xl p-4 sm:p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {items.map((item) => (
                        <div
                            key={item.label}
                            className="bg-[#E6F1FB] rounded-lg p-4"
                        >
                            <div className="text-[12px] text-[#1E3A8A] uppercase tracking-wider mb-2 font-medium">
                                {item.label}
                            </div>
                            <div className="text-[26px] font-medium leading-tight text-[#0A1628]">
                                {item.value}
                                <span className="text-[14px] font-normal text-[#1E3A8A] ml-1 opacity-70">
                                    {item.unit}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}