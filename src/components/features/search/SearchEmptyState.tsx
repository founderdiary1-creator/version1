'use client';

import Link from 'next/link';
import { TrendingData } from '@/app/actions/search.actions';
import { TrendingUp, Layers } from 'lucide-react';
import SearchResultCard from './SearchResultCard';

export default function SearchEmptyState({ 
  data, 
  isLoading 
}: { 
  data?: TrendingData; 
  isLoading: boolean;
}) {
  if (isLoading || !data) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-2xl w-full"></div>;
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Categories Cloud */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Layers className="w-5 h-5 text-gray-400" />
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500">Browse Categories</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {data.categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:text-[#E31E24] hover:border-[#E31E24]/30 hover:shadow-[0_4px_15px_rgba(227,30,36,0.1)] transition-all duration-300 active:scale-95"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Articles */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-[#E31E24]" />
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500">Trending Right Now</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.trendingArticles.map((article, index) => (
            <SearchResultCard key={article.slug} article={article} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}