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
    // 데이터가 없거나 에러 시 플레이스홀더 유지
    if (!metrics) {
        return (
            <div className="bg-neutral-50 border border-dashed border-neutral-300 rounded-xl p-7 mb-8 text-center">
                <div className="text-[11px] text-neutral-500 uppercase tracking-widest mb-2 font-medium">
                    KPI · GA4
                </div>
                <div className="text-[15px] text-neutral-500 font-medium mb-1">
                    데이터를 불러올 수 없어
                </div>
                <div className="text-[13px] text-neutral-400">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {items.map((item) => (
                    <div key={item.label} className="bg-neutral-50 rounded-lg p-4">
                        <div className="text-[13px] text-neutral-500 mb-2">{item.label}</div>
                        <div className="text-[26px] font-medium leading-tight">
                            {item.value}
                            <span className="text-[14px] font-normal text-neutral-500 ml-1">
                                {item.unit}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}