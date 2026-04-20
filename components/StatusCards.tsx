import type { StatusCard } from '@/lib/types';

const pillStyles = {
    risk: 'bg-red-50 text-red-700',
    watch: 'bg-orange-50 text-orange-700',
    opportunity: 'bg-blue-50 text-blue-700',
};

const pillLabels = {
    risk: 'RISK',
    watch: 'WATCH',
    opportunity: 'OPPORTUNITY',
};

export default function StatusCards({ cards }: { cards: StatusCard[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-7">
            {cards.map((c) => (
                <div
                    key={c.rank}
                    className="bg-white border border-neutral-200 rounded-xl p-4"
                >
                    <span
                        className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mb-2.5 tracking-wide ${pillStyles[c.type]}`}
                    >
                        {c.rank} · {pillLabels[c.type]}
                    </span>
                    <h3 className="text-[15px] font-medium m-0 mb-1.5">{c.title}</h3>
                    <p className="text-[13px] text-neutral-500 leading-relaxed m-0">
                        {c.subtext}
                    </p>
                    <div className="text-[20px] font-medium mt-2.5">
                        {c.metric}
                        <span className="text-[13px] font-normal text-neutral-500 ml-1.5">
                            {c.metricLabel}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}