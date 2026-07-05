'use client';

import { useState, useTransition, use } from 'react';
import { useCategoryBySlug, usePaginatedStories } from '@/hooks/useStories';
import { useIndustriesQuery } from '@/hooks/useTaxonomy';
import { ArticleCardHorizontal } from '@/components/features/ArticleCardHorizontal';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Pagination } from '@/components/ui/Pagination';
import { SlidersHorizontal, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  useScrollReveal();

  // State & Transitions
  const [currentPage, setCurrentPage] = useState(1);
  const [activeIndustry, setActiveIndustry] = useState<string>(''); 
  const [isPending, startTransition] = useTransition();

  // 1. Fetch Real Category Details (Validates the slug)
  const { data: categoryData, isLoading: loadingCategory, isError: categoryError } = useCategoryBySlug(slug);

  // 2. Fetch Industries (For the filter ribbon)
  const { data: industriesData = [], isLoading: loadingIndustries } = useIndustriesQuery();
  
  // 3. Fetch Data based on Real Category Slug & Active Industry
  const { data: storiesData, isLoading: loadingStories, isError: storiesError } = usePaginatedStories(
    currentPage, 
    10, 
    slug, 
    activeIndustry
  );

  const articles = storiesData?.data ?? [];
  const totalPages = storiesData?.totalPages ?? 0;

  // Handle Invalid Category Slug (404 state)
  if (categoryError) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center p-6">
        <div className="text-center bg-white p-10 rounded-3xl border border-gray-100 shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Category Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">The section you are looking for doesn't exist or has been moved.</p>
          <Link href="/" className="bg-gray-900 text-white font-bold px-6 py-3 rounded-full hover:bg-black transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Smooth Filter Handler
  const handleIndustrySelect = (industryId: string) => {
    if (activeIndustry === industryId) return;
    startTransition(() => {
      setActiveIndustry(industryId);
      setCurrentPage(1); 
    });
  };

  const title = categoryData?.name || 'Loading...';

  return (
    <div className="bg-[#FAFBFD] min-h-screen selection:bg-[#E31E24]/10 selection:text-[#E31E24]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        
        {/* PREMIUM HEADER & BREADCRUMBS */}
        <div className="mb-8 space-y-4">
          <nav className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#E31E24]">
              {loadingCategory ? '...' : title}
            </span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            {loadingCategory ? 'Loading Section...' : title}
          </h1>
        </div>

        {/* MINIMALISTIC FILTER RIBBON */}
        {!loadingCategory && (
          <div className="mb-10 relative">
            <div className="flex items-center gap-3 mb-4">
              <SlidersHorizontal size={16} className="text-gray-400" />
              <span className="text-sm font-bold text-gray-900">Refine by Industry</span>
            </div>
            
            <div className="flex overflow-x-auto sm:flex-wrap gap-2 pb-2 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {/* Reset Tag */}
              <button
                onClick={() => handleIndustrySelect('')}
                className={`shrink-0 text-sm font-semibold px-5 py-2.5 rounded-full border transition-all duration-300 ease-out ${
                  activeIndustry === '' 
                    ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-105' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                All {title}
              </button>

              {loadingIndustries ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="shrink-0 w-24 h-10 bg-gray-200 rounded-full animate-pulse" />
                ))
              ) : (
                industriesData.map((ind: any) => (
                  <button
                    key={ind.id}
                    onClick={() => handleIndustrySelect(ind.id)} 
                    className={`shrink-0 text-sm font-semibold px-5 py-2.5 rounded-full border transition-all duration-300 ease-out ${
                      activeIndustry === ind.id 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-105' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {ind.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* FEED CONTAINER WITH OPACITY TRANSITION */}
        <div className={`transition-opacity duration-300 ${isPending || loadingStories || loadingCategory ? 'opacity-50' : 'opacity-100'}`}>
          <div className="space-y-4">
            
            {loadingStories && articles.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="inline-block w-8 h-8 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-sm font-bold text-gray-400">Loading intelligence...</p>
              </div>
            ) : storiesError ? (
              <div className="text-center py-20 bg-red-50/50 rounded-2xl border border-red-100 text-sm font-bold text-red-600">
                Failed to load stories. Please try refreshing the page.
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400">
                <p className="text-base font-bold text-gray-700 mb-1">No reports found.</p>
                <p className="text-xs max-w-xs mx-auto leading-normal">
                  We haven't published any {activeIndustry ? 'reports in this specific industry' : 'stories in this category'} yet.
                </p>
              </div>
            ) : (
              articles.map((article: any) => (
                <div key={article.id} className="scroll-reveal transition-transform duration-300 hover:-translate-y-1">
                  <ArticleCardHorizontal
                    image={article.featured_image || '/images/news-funding.jpg'}
                    category={article.categories?.name || title.toUpperCase()}
                    title={article.title}
                    author={article.author_name || 'Founder Diary'}
                    date={article.published_at ? new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                    slug={article.slug}
                  />
                </div>
              ))
            )}
          </div>

          {!loadingStories && !storiesError && totalPages > 1 && (
            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}