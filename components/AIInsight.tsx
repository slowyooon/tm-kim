import type { AIInsight } from '@/lib/types';

export default function AIInsightCard({ data }: { data: AIInsight }) {
    return (
        <div className="bg-brand-black border border-brand-blue-deep rounded-2xl p-5 sm:p-6 mb-5">
            <div className="text-[11px] text-brand-blue-400 uppercase tracking-widest mb-3 inline-flex items-center gap-2 font-medium">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-blue-400" />
                오늘의 AI 인사이트
            </div>
            <h2 className="text-[18px] font-medium text-brand-blue-50 leading-snug m-0 mb-2.5">
                {data.title}
            </h2>
            <p className="text-[14px] text-brand-blue-200 leading-relaxed m-0">
                {data.subtext}
            </p>
        </div>
    );
}