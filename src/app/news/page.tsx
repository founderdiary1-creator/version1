'use client';

import { useState, useTransition } from 'react';
import { usePaginatedStories } from '@/hooks/useStories';
import { useCategoriesQuery, useIndustriesQuery } from '@/hooks/useTaxonomy';
import { ArticleCardHorizontal } from '@/components/features/ArticleCardHorizontal';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Pagination } from '@/components/ui/Pagination';
import { SlidersHorizontal, Tag, Layers, Check, RefreshCw } from 'lucide-react';

export default function NewsPage() {
  useScrollReveal();
  
  // Dynamic Hooks for Taxonomy
  const { data: databaseCategories = [], isLoading: loadingCats } = useCategoriesQuery();
  const { data: databaseIndustries = [], isLoading: loadingInds } = useIndustriesQuery();

  // State Management
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeIndustry, setActiveIndustry] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // useTransition creates micro-interaction states during data re-validation
  const [isPending, startTransition] = useTransition();

  // Fetch updated records matching both taxonomy branches
  // Note: Ensure your implementation of usePaginatedStories handles an optional 4th parameter or options object
  const { data, isLoading, isError } = usePaginatedStories(
    currentPage, 
    10, 
    activeCategory, 
    activeIndustry
  );

  const articles = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;

  // --- Handlers ---
  const handleCategorySelect = (id: string) => {
    startTransition(() => {
      setActiveCategory(id);
      setCurrentPage(1);
    });
  };

  const handleIndustrySelect = (id: string) => {
    startTransition(() => {
      setActiveIndustry(id);
      setCurrentPage(1);
    });
  };

  const handleResetFilters = () => {
    startTransition(() => {
      setActiveCategory('');
      setActiveIndustry('');
      setCurrentPage(1);
    });
  };

  const isFilterActive = activeCategory !== '' || activeIndustry !== '';

  return (
    <div className="bg-[#FAFBFD] min-h-screen selection:bg-[#E31E24]/10 selection:text-[#E31E24]">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Editorial Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200/60 pb-8 mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">
              <SlidersHorizontal size={12} className="text-[#E31E24]" /> Intelligence Desk
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight sm:text-5xl">
              Ecosystem Hub
            </h1>
            <p className="text-gray-500 mt-2 text-base max-w-xl font-medium leading-relaxed">
              Real-time transactional intelligence, market breakdowns, and analysis curated natively across Indian startup ecosystems.
            </p>
          </div>
          
          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#E31E24] bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all group duration-200"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              Reset Active Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* TAXONOMY SIDEBAR PANELS */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Category Ribbon Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layers size={14} className="text-gray-400" /> Segment Stream
              </h2>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleCategorySelect('')}
                  className={`flex items-center justify-between text-left text-sm font-bold px-4 py-3 rounded-xl border transition-all duration-200 ${
                    activeCategory === '' 
                      ? 'bg-[#E31E24]/5 text-[#E31E24] border-[#E31E24]/20' 
                      : 'bg-transparent text-gray-700 border-transparent hover:bg-gray-50'
                  }`}
                >
                  <span>All Segments</span>
                  {activeCategory === '' && <Check size={14} strokeWidth={3} />}
                </button>
                
                {loadingCats ? (
                  <div className="space-y-2 py-2">
                    {[1, 2, 3].map((n) => <div key={n} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
                  </div>
                ) : (
                  databaseCategories.map((cat: any) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`flex items-center justify-between text-left text-sm font-bold px-4 py-3 rounded-xl border transition-all duration-200 ${
                        activeCategory === cat.id 
                          ? 'bg-[#E31E24]/5 text-[#E31E24] border-[#E31E24]/20' 
                          : 'bg-transparent text-gray-700 border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {activeCategory === cat.id && <Check size={14} strokeWidth={3} />}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Industry Tags Container */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Tag size={14} className="text-gray-400" /> Market Segments
              </h2>
              
              {loadingInds ? (
                <div className="flex flex-wrap gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((n) => <div key={n} className="h-8 w-20 bg-gray-100 rounded-full animate-pulse" />)}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleIndustrySelect('')}
                    className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all duration-200 ${
                      activeIndustry === ''
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-white'
                    }`}
                  >
                    All Sectors
                  </button>
                  
                  {databaseIndustries.map((ind: any) => (
                    <button
                      key={ind.id}
                      onClick={() => handleIndustrySelect(ind.id)}
                      className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all duration-200 flex items-center gap-1.5 ${
                        activeIndustry === ind.id 
                          ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-[1.02]' 
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-white hover:scale-[1.01]'
                      }`}
                    >
                      {ind.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* MAIN ARTICLES FEED */}
          <div className="lg:col-span-8">
            <div className={`transition-opacity duration-300 ${isPending || isLoading ? 'opacity-60' : 'opacity-100'}`}>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-32 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="inline-block w-8 h-8 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
                    <p className="mt-4 text-sm text-gray-400 font-bold tracking-wide">Syncing data layer...</p>
                  </div>
                ) : isError ? (
                  <div className="text-center py-20 bg-red-50/50 rounded-2xl border border-red-100 text-sm font-semibold text-red-600">
                    Failed to fetch dynamic index records. Please try refiltering.
                  </div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-32 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400">
                    <p className="text-base font-bold text-gray-700 mb-1">No matching intelligence found</p>
                    <p className="text-xs max-w-xs mx-auto text-gray-400 leading-normal">
                      Try updating your dynamic selection grid matrix or resetting configurations.
                    </p>
                  </div>
                ) : (
                  articles.map((article: any) => (
                    <div key={article.id} className="scroll-reveal transition-transform duration-300 hover:-translate-y-0.5">
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

              {/* Strict Pagination Grid */}
              {!isLoading && !isError && totalPages > 1 && (
                <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center">
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
      </div>
    </div>
  );
}