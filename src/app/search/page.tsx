import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchClientView from '@/components/features/search/SearchClientView';

export const metadata: Metadata = {
  title: 'Search | Founder Diary',
  description: 'Search for startups, founders, funding rounds, and in-depth analysis.',
  robots: { index: false, follow: true }, // Search result pages shouldn't be indexed by Google
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const initialQuery = q || '';

  return (
    <div className="min-h-[80vh] bg-gray-50 pt-8 pb-20 selection:bg-[#E31E24] selection:text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Suspense boundary for useSearchParams hook inside the client component */}
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-2xl"></div>}>
          <SearchClientView initialQuery={initialQuery} />
        </Suspense>
      </div>
    </div>
  );
}