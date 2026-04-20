import type { OwnProduct } from '@/lib/ownProducts';

function formatDuration(sec: number): string {
    if (sec === 0) return '—';
    if (sec < 60) return `${sec}초`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}분 ${s}초`;
}

export default function OwnTable({ products }: { products: OwnProduct[] }) {
    return (
        <section className="mb-8">
            <h2 className="text-[18px] font-medium mb-3.5">
                자체몰 상품
                <span className="text-[13px] text-neutral-500 font-normal ml-2">
                    {products.length}개 · betterlifehere.com
                </span>
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-[13px] border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left font-medium text-neutral-500 text-[12px] px-3 py-2.5 border-b border-neutral-200">상품</th>
                            <th className="text-right font-medium text-neutral-500 text-[12px] px-3 py-2.5 border-b border-neutral-200">정가</th>
                            <th className="text-right font-medium text-neutral-500 text-[12px] px-3 py-2.5 border-b border-neutral-200">판매가</th>
                            <th className="text-right font-medium text-neutral-500 text-[12px] px-3 py-2.5 border-b border-neutral-200">주간 페이지뷰</th>
                            <th className="text-right font-medium text-neutral-500 text-[12px] px-3 py-2.5 border-b border-neutral-200">평균 체류</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.path} className="bg-blue-50/40">
                                <td className="px-3 py-3.5 border-b border-neutral-200 font-medium text-blue-700">
                                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{p.name}</a>
                                </td>
                                <td className="px-3 py-3.5 border-b border-neutral-200 text-right text-neutral-500">
                                    <span className="line-through">{p.priceList.toLocaleString()}원</span>
                                </td>
                                <td className="px-3 py-3.5 border-b border-neutral-200 text-right font-medium">
                                    {p.priceSale.toLocaleString()}원
                                    <span className="text-[11px] text-state-danger ml-1.5">−{p.discountPercent}%</span>
                                </td>
                                <td className="px-3 py-3.5 border-b border-neutral-200 text-right">{p.pageViews > 0 ? p.pageViews.toLocaleString() : '—'}</td>
                                <td className="px-3 py-3.5 border-b border-neutral-200 text-right">{formatDuration(p.avgTimeSec)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}