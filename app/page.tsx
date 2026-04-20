import Header from '@/components/Header';
import AIInsightCard from '@/components/AIInsight';
import StatusCards from '@/components/StatusCards';
import KpiCards from '@/components/KpiCards';
import KmongTable from '@/components/KmongTable';
import OwnTable from '@/components/OwnTable';
import TrendKeywords from '@/components/TrendKeywords';
import TodoList from '@/components/TodoList';
import { fetchKmongProduct, parseKmongEntry } from '@/lib/kmong';
import type { KmongProduct } from '@/lib/kmong';
import { fetchGA4Metrics } from '@/lib/ga4';
import type { GA4Metrics } from '@/lib/ga4';
import { fetchOwnProducts } from '@/lib/ownProducts';
import type { OwnProduct } from '@/lib/ownProducts';
import {
  mockAIInsight,
  mockStatusCards,
  mockTrendKeywords,
  mockTodos,
} from '@/lib/mockData';

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

async function getGAMetrics(): Promise<GA4Metrics | null> {
  try {
    return await fetchGA4Metrics(7);
  } catch (err) {
    console.error('GA4 fetch error:', err);
    return null;
  }
}

async function getOwnProducts(): Promise<OwnProduct[]> {
  try {
    return await fetchOwnProducts(7);
  } catch (err) {
    console.error('Own products fetch error:', err);
    return [];
  }
}

export default async function Home() {
  const [kmongProducts, gaMetrics, ownProducts] = await Promise.all([
    getKmongProducts(),
    getGAMetrics(),
    getOwnProducts(),
  ]);

  return (
    <main className="max-w-6xl mx-auto px-5 sm:px-8 py-6 sm:py-8">
      <Header />
      <AIInsightCard data={mockAIInsight} />
      <StatusCards cards={mockStatusCards} />
      <KpiCards metrics={gaMetrics} />
      <KmongTable products={kmongProducts} />
      <OwnTable products={ownProducts} />
      <TrendKeywords keywords={mockTrendKeywords} />
      <TodoList todos={mockTodos} />
    </main>
  );
}