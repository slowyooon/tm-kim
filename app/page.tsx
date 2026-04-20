import Header from '@/components/Header';
import AIInsightCard from '@/components/AIInsight';
import StatusCards from '@/components/StatusCards';
import KmongTable from '@/components/KmongTable';
import TrendKeywords from '@/components/TrendKeywords';
import TodoList from '@/components/TodoList';
import type { KmongProduct } from '@/lib/kmong';
import {
  mockAIInsight,
  mockStatusCards,
  mockTrendKeywords,
  mockTodos,
} from '@/lib/mockData';

import { fetchKmongProduct, parseKmongEntry } from '@/lib/kmong';

async function getKmongProducts(): Promise<KmongProduct[]> {
  const urlsEnv = process.env.KMONG_URLS || '';
  const entries = urlsEnv.split(',').map((s) => s.trim()).filter(Boolean);

  if (entries.length === 0) return [];

  const results = await Promise.all(
    entries.map(async (entry) => {
      const { url, priceMin, priceMax } = parseKmongEntry(entry);
      try {
        return await fetchKmongProduct(url, priceMin, priceMax);
      } catch {
        return null;
      }
    })
  );

  return results.filter((p): p is KmongProduct => p !== null);
}

export default async function Home() {
  const kmongProducts = await getKmongProducts();

  return (
    <main className="max-w-6xl mx-auto px-5 sm:px-8 py-6 sm:py-8">
      <Header />
      <AIInsightCard data={mockAIInsight} />
      <StatusCards cards={mockStatusCards} />
      {/* KPI 자리 — 끝판왕KIM 협의 후 추가 */}
      <div className="bg-neutral-50 border border-dashed border-neutral-300 rounded-xl p-7 mb-8 text-center">
        <div className="text-[11px] text-neutral-500 uppercase tracking-widest mb-2 font-medium">
          KPI 자리
        </div>
        <div className="text-[15px] text-neutral-500 font-medium mb-1">
          끝판왕KIM 협의 후 추가
        </div>
        <div className="text-[13px] text-neutral-400">
          방문자 / 전환율 / 체류시간 등
        </div>
      </div>
      <KmongTable products={kmongProducts} />
      <TrendKeywords keywords={mockTrendKeywords} />
      <TodoList todos={mockTodos} />
    </main>
  );
}