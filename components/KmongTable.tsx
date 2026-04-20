import type { KmongProduct } from '@/lib/kmong';

function formatPrice(min: number | null, max: number | null): string {
    if (min === null || max === null) return '—';
    if (min === max) return `${min.toLocaleString()}원`;
    return `${min.toLocaleString()}~${max.toLocaleString()}원`;
}

export default function KmongTable({ products }: { products: KmongProduct[] }) {
    return (
        <section className="mb-8">
            <h2 className="text-[18px] font-medium mb-3.5">
                크몽 상품
                <span className="text-[13px] text-neutral-500 font-normal ml-2">
                    {products.length}개
                </span>
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-[13px] border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left font-medium text-neutral-500 text-[12px] px-3 py-2.5 border-b border-neutral-200">상품</th>
                            <th className="text-right font-medium text-neutral-500 text-[12px] px-3 py-2.5 border-b border-neutral-200">가격</th>
                            <th className="text-right font-medium text-neutral-500 text-[12px] px-3 py-2.5 border-b border-neutral-200">리뷰</th>
                            <th className="text-right font-medium text-neutral-500 text-[12px] px-3 py-2.5 border-b border-neutral-200">평점</th>
                            <th className="text-right font-medium text-neutral-500 text-[12px] px-3 py-2.5 border-b border-neutral-200">만족도</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.gigId} className="bg-blue-50/40">
                                <td className="px-3 py-3.5 border-b border-neutral-200 font-medium text-blue-700">
                                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{p.title}</a>
                                </td>
                                <td className="px-3 py-3.5 border-b border-neutral-200 text-right">{formatPrice(p.priceMin, p.priceMax)}</td>
                                <td className="px-3 py-3.5 border-b border-neutral-200 text-right">{p.reviewCount?.toLocaleString() ?? '—'}</td>
                                <td className="px-3 py-3.5 border-b border-neutral-200 text-right">{p.rating ?? '—'}</td>
                                <td className="px-3 py-3.5 border-b border-neutral-200 text-right">{p.satisfactionRate !== null ? `${p.satisfactionRate}%` : '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}