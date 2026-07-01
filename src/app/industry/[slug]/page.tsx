'use client';

import { useState, use } from 'react';
import { usePaginatedStories } from '@/hooks/useStories';
import { ArticleCardHorizontal } from '@/components/features/ArticleCardHorizontal';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Pagination } from '@/components/ui/Pagination';

export default function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  useScrollReveal();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Note: We pass undefined for category, and slug for industry
  const { data, isLoading, isError } = usePaginatedStories(currentPage, 10, undefined, slug);

  const articles = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;

  // Format the slug into a readable title
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="mb-10 pb-6 border-b border-gray-100">
          <div className="text-xs font-bold tracking-widest text-[#E31E24] uppercase mb-2">Industry Focus</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{title}</h1>
        </div>

        {/* Articles */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-500">Loading industry insights...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-500">
              Failed to load stories for this industry.
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No insights published in {title} yet.
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
