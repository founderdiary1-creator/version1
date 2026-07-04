'use client';

import { ArticleCardHorizontal } from './ArticleCardHorizontal';
import { Flame, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const startups = [
  { name: 'Lickicious', letter: 'L', sector: 'FoodTech', totalFunding: '$52.8K+', stage: 'Angel Round' },
  { name: 'Sapioin', letter: 'S', sector: 'AI/ML', totalFunding: '$15.8Mn+', stage: 'Seed' },
  { name: 'Baba', letter: 'B', sector: 'Logistics', totalFunding: '$6.5Mn+', stage: 'Seed' },
  { name: 'Circato', letter: 'C', sector: 'SaaS', totalFunding: '$97.4K+', stage: 'Angel Round' },
  { name: 'ProLearn', letter: 'P', sector: 'EdTech', totalFunding: '$3.2Mn+', stage: 'Pre-Seed' },
];

// Upgraded Startup Card built inline to match the premium ecosystem
function PremiumStartupCard({ name, letter, sector, totalFunding, stage }: any) {
  return (
    <div className="group flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-gray-50/80 transition-all duration-300 cursor-pointer">
      <div className="flex items-center gap-4">
        {/* Animated Avatar Box */}
        <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 shadow-sm group-hover:border-[#E31E24]/30 group-hover:text-[#E31E24] group-hover:shadow-md transition-all duration-300">
          {letter}
        </div>
        
        <div className="flex flex-col justify-center">
          <h4 className="text-[15px] font-bold text-gray-900 leading-tight group-hover:text-[#E31E24] transition-colors duration-300 mb-0.5">
            {name}
          </h4>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 uppercase tracking-wide">
            <span>{sector}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{stage}</span>
          </div>
        </div>
      </div>

      <div className="text-right shrink-0 ml-4">
        <div className="text-[14px] font-extrabold text-gray-900 tracking-tight">
          {totalFunding}
        </div>
        <div className="text-[10px] font-bold text-[#E31E24] uppercase tracking-wider mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
          Raised
        </div>
      </div>
    </div>
  );
}

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
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
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

          {/* Right Column: Premium Sticky Startup Widget (Mock Data) */}
          <div className="lg:col-span-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
            
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-gray-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 lg:p-7 relative overflow-hidden group/widget">
                
                {/* Decorative subtle background gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -z-10 group-hover/widget:bg-red-100 transition-colors duration-700"></div>

                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                      <Flame className="w-5 h-5 text-[#E31E24] animate-pulse-soft" fill="currentColor" />
                      Hot Early Stage
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                      Startups making waves this week
                    </p>
                  </div>
                  
                  {/* Premium "Powered By" Badge */}
                  <div className="flex flex-col items-end gap-1 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Powered by</span>
                    <div className="flex items-center gap-1.5">
                      <Image src="/images/logo2.png" alt="Datalabs" width={10} height={10} className="w-2.5 h-2.5 opacity-80" />
                      <span className="text-[10px] font-extrabold text-[#E31E24] tracking-wide">DATALABS</span>
                    </div>
                  </div>
                </div>

                {/* Startups List */}
                <div className="flex flex-col gap-2 mb-8">
                  {startups.map((startup, idx) => (
                    <PremiumStartupCard key={idx} {...startup} />
                  ))}
                </div>

                {/* Interactive Premium Button */}
                <button className="relative w-full overflow-hidden bg-gray-900 text-white font-bold text-sm tracking-wide py-4 rounded-xl shadow-md transition-all duration-300 hover:bg-[#E31E24] hover:shadow-[0_8px_20px_rgb(227,30,36,0.25)] hover:-translate-y-0.5 group/btn">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Explore Funding Data
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </span>
                </button>

              </div>
            </div>

          </div>
          
        </div>
      </section>
    </>
  );
}