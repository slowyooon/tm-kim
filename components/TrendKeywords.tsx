import type { TrendKeyword } from '@/lib/types';

export default function TrendKeywords({ keywords }: { keywords: TrendKeyword[] }) {
    return (
        <section className="mb-8">
            <h2 className="text-[18px] font-medium mb-3.5">
                트렌드 · Top {keywords.length}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {keywords.map((k) => (
                    <div
                        key={k.keyword}
                        className="grid grid-cols-[1fr_70px] items-center gap-2 px-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-[13px]"
                    >
                        <div>
                            <span className="text-[11px] text-neutral-400 mr-2">{k.category}</span>
                            {k.keyword}
                        </div>
                        <div
                            className={`text-right font-medium ${k.weeklyChange >= 0 ? 'text-state-success' : 'text-state-danger'
                                }`}
                        >
                            {k.weeklyChange >= 0 ? '+' : ''}
                            {k.weeklyChange}%
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}