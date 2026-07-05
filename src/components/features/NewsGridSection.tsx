'use client';

import { ArticleCardHorizontal } from './ArticleCardHorizontal';

interface NewsGridSectionProps {
  articles: any[];
  isLoading: boolean;
}

export function NewsGridSection({ articles, isLoading }: NewsGridSectionProps) {

  // Shimmer loading state
  if (isLoading) {
    return (
      <>
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
        <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8 flex flex-col gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-[280px] aspect-[16/10] rounded-xl animate-shimmer shrink-0" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-4 w-24 rounded animate-shimmer" />
                    <div className="h-6 w-full rounded animate-shimmer" />
                    <div className="h-4 w-3/4 rounded animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-4">
              <div className="h-[500px] rounded-2xl animate-shimmer" />
            </div>
          </div>
        </section>
      </>
    );
  }

  if (articles.length === 0) return null;

  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <>
      {/* Animation Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
        .animate-fade-up {
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
      `}} />

      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16 sm:py-20">
        
        <div className="grid grid-cols-1  gap-18">
          
          {/* Left Column: Articles List */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* Featured Article - gets a subtle highlight badge */}
            <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#E31E24] animate-pulse-soft"></span>
                <span className="text-[11px] font-bold tracking-widest text-[#E31E24] uppercase">Top Story</span>
              </div>
              <ArticleCardHorizontal {...featuredArticle} />
            </div>

            {/* Subtle Divider */}
            <hr className="my-8 border-gray-100/80 animate-fade-up" style={{ animationDelay: '100ms' }} />

            {/* Standard Articles List */}
            <div className="flex flex-col gap-8 lg:gap-10">
              {remainingArticles.map((article, idx) => (
                <div 
                  key={article.id || idx} 
                  className="animate-fade-up"
                  style={{ animationDelay: `${(idx + 2) * 100}ms` }}
                >
                  <ArticleCardHorizontal {...article} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}