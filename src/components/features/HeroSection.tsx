'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useHeroStories } from '@/hooks/useHeroStories';
import { FeaturedArticleCard } from './FeaturedArticleCard';
import { EditorPickItem } from './EditorPickItem';
import { ArticleCardVertical } from './ArticleCardVertical';
import { TrendingTicker } from '../TrendingTicker';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Sparkles, Activity } from 'lucide-react';

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function HeroSection() {
  const { data, isLoading, isError, error } = useHeroStories();

  // Smooth scroll-reveal animations
  useEffect(() => {
    if (isLoading || !data) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isLoading, data]);

  // High-End Shimmer Skeleton
  if (isLoading) {
    return (
      <section className="bg-white min-h-[70vh] overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .animate-shimmer {
            background: linear-gradient(to right, #f3f4f6 4%, #ffffff 25%, #f3f4f6 36%);
            background-size: 1000px 100%;
            animation: shimmer 2s infinite linear;
          }
        `}} />
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Ticker skeleton */}
          <div className="h-12 rounded-xl animate-shimmer w-full mb-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="h-4 rounded animate-shimmer w-32" />
              <div className="aspect-[16/9] rounded-2xl animate-shimmer w-full shadow-sm" />
              <div className="h-8 rounded animate-shimmer w-3/4 mt-4" />
              <div className="h-4 rounded animate-shimmer w-full" />
              <div className="h-4 rounded animate-shimmer w-5/6" />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="h-8 rounded animate-shimmer w-1/2 mb-4" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-10 rounded animate-shimmer shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 rounded animate-shimmer w-full" />
                    <div className="h-3 rounded animate-shimmer w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="bg-white py-24 flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4 px-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="text-[#E31E24] w-8 h-8" />
          </div>
          <h2 className="text-gray-900 font-extrabold text-2xl tracking-tight">Intelligence Feed Unavailable</h2>
          <p className="text-base text-gray-500 max-w-md mx-auto">
            {error instanceof Error ? error.message : 'We are unable to load the latest briefings. Please verify your connection and refresh the page.'}
          </p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-[#E31E24] transition-colors">
            Refresh Feed
          </button>
        </div>
      </section>
    );
  }

  const trendingTags = data?.trendingTags ?? [];
  const exclusiveStory = data?.exclusiveStory ?? null;
  const EditorPick = data?.editorPicks ?? []; 
  const subFeatures = data?.subFeatures ?? []; 

  return (
    <>
      {/* Global premium animation styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .scroll-reveal {
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .scroll-reveal-delay-1 { transition-delay: 150ms; }
        .scroll-reveal-delay-2 { transition-delay: 300ms; }
        .scroll-reveal-delay-3 { transition-delay: 450ms; }
        .scroll-reveal-delay-4 { transition-delay: 600ms; }
        
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(227, 30, 36, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(227, 30, 36, 0); }
          100% { box-shadow: 0 0 0 0 rgba(227, 30, 36, 0); }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
        }
      `}} />

      <section className="bg-white overflow-hidden pt-6 pb-16 sm:pb-20">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Market Ticker - Sleek isolation */}
          <div className="mb-10 lg:mb-14 scroll-reveal revealed">
            <TrendingTicker tags={trendingTags} />
          </div>

          {/* Primary Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16">
            
            {/* Main Hero Spotlight (8 Columns) */}
            <div className="lg:col-span-8 flex flex-col scroll-reveal">
              <ErrorBoundary>
                {/* Premium Label */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-[#E31E24] animate-pulse-ring" />
                  <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-[#E31E24]">
                    {exclusiveStory?.is_premium ? 'Premium Intelligence' : 'Featured Briefing'}
                  </span>
                </div>
                
                {exclusiveStory ? (
                  <div className="group relative">
                    <FeaturedArticleCard
                      image={exclusiveStory?.featured_image ?? '/images/placeholder.jpg'}
                      category={exclusiveStory?.category?.name ?? 'IN-DEPTH'}
                      title={exclusiveStory?.title ?? 'Strategic Overview'}
                      excerpt={exclusiveStory?.summary ?? ''}
                      author={exclusiveStory?.author_name ?? 'Team Founder Diary'}
                      date={formatDate(exclusiveStory?.published_at ?? exclusiveStory?.created_at)}
                      slug={exclusiveStory?.slug ?? '#'}
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-gray-50/50 flex flex-col items-center justify-center rounded-2xl border border-gray-200 border-dashed">
                    <Activity className="w-6 h-6 text-gray-300 mb-2" />
                    <p className="text-gray-400 font-medium text-sm tracking-wide">Awaiting briefing data...</p>
                  </div>
                )}

                {/* Supporting Intel Grid (3 Columns) */}
          {subFeatures.length > 0 && (
            <div className="pt-16 relative">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {subFeatures.map((sub: any, index: number) => (
                  <ErrorBoundary key={sub.id || index}>
                    <div className={`scroll-reveal scroll-reveal-delay-${(index % 3) + 2}`}>
                      <ArticleCardVertical
                        image={sub?.featured_image ?? '/images/placeholder.jpg'}
                        category={sub?.category?.name ?? 'ANALYSIS'}
                        title={sub?.title ?? 'Untitled'}
                        author={sub?.author_name ?? 'Team Founder Diary'}
                        date={formatDate(sub?.published_at ?? sub?.created_at)}
                        slug={sub?.slug ?? '#'}
                      />
                    </div>
                  </ErrorBoundary>
                ))}
              </div>
            </div>
          )}

              </ErrorBoundary>
            </div>

            {/* Editor's Choice Section (4 Columns) */}
            <div className="lg:col-span-4 flex flex-col scroll-reveal scroll-reveal-delay-1">
              
              <div className="bg-gray-50/60 rounded-2xl border border-gray-100/80 p-6 lg:p-7 h-full shadow-[inset_0_2px_20px_rgba(255,255,255,1)]">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <h2 className="text-sm font-extrabold tracking-[0.15em] text-gray-900 uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E31E24]" />
                    Editor&apos;s Focus
                  </h2>
                </div>
                
                <ErrorBoundary>
                  {EditorPick && EditorPick.length > 0 ? (
                    <div className="flex flex-col space-y-2"> 
                      {EditorPick.map((pick, index) => (
                        <div key={pick.id || index}>
                          <EditorPickItem 
                            number={index + 1}
                            title={pick.title || 'Untitled'} 
                            author={pick.author_name || 'Team Founder Diary'}
                            date={formatDate(pick.published_at || pick.created_at)}
                            readTime={pick.read_time || '5 min read'}
                            slug={pick.slug || '#'}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center mb-3">
                        <Sparkles className="w-4 h-4 text-gray-300" />
                      </div>
                      <p className="text-sm font-medium text-gray-400">Curating the latest focus articles.</p>
                    </div>
                  )}
                </ErrorBoundary>
              </div>
            </div>
          </div>

          

        </div>
      </section>
    </>
  );
}