'use client';

import { useState } from 'react';
import { usePaginatedStories } from '@/hooks/useStories';
import { ArticleCardHorizontal } from '@/components/features/ArticleCardHorizontal';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Pagination } from '@/components/ui/Pagination';

const categories = [
  { label: 'All', value: '' },
  { label: 'News', value: 'news' },
  { label: 'Fintech', value: 'fintech' },
  { label: 'Edtech', value: 'edtech' },
  { label: 'Ecommerce', value: 'ecommerce' },
  { label: 'Enterprise Tech', value: 'enterprise-tech' },
  { label: 'Consumer Services', value: 'consumer-services' },
  { label: 'AI Economy', value: 'ai-economy' },
];

export default function NewsPage() {
  useScrollReveal();
  const [activeCategory, setActiveCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, isLoading, isError } = usePaginatedStories(currentPage, 10, activeCategory);

  const handleCategoryChange = (val: string) => {
    setActiveCategory(val);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const articles = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">News & Updates</h1>
        <p className="text-gray-500 mb-8">Latest breaking news from India&apos;s startup ecosystem</p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`text-xs font-medium px-4 py-2 rounded-full border transition-colors ${
                activeCategory === cat.value 
                  ? 'bg-[#E31E24] text-white border-[#E31E24]' 
                  : 'bg-white text-gray-900 border-gray-200 hover:border-[#E31E24] hover:text-[#E31E24]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-500">Loading stories...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-500">
              Failed to load stories. Please try again.
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No stories found for this category.
            </div>
          ) : (
            articles.map((article) => (
              <div key={article.id} className="scroll-reveal">
                <ArticleCardHorizontal
                  image={article.featured_image || '/images/news-funding.jpg'}
                  category={article.category?.name || 'NEWS'}
                  title={article.title}
                  author={article.author_name || 'Founder Diary'}
                  date={article.published_at ? new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  slug={article.slug}
                />
              </div>
            ))
          )}
        </div>

        {/* Strict Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        )}
      </div>
    </div>
  );
}
