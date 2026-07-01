'use client';

import { ArticleCardHorizontal } from './ArticleCardHorizontal';
import { TrendingUp, ArrowRight, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const articles = [
  { image: '/images/news-byjus.jpg', category: 'EDTECH', title: "BYJU'S Lenders Seek 30% Stake In Aakash To Settle Legal Battle: Report", author: 'Gaurav B.', date: '26th June, 2026' },
  { image: '/images/news-rbi.jpg', category: 'NEWS', title: "Project 'Kill Switch': Can RBI Protect Banks, NBFCs From Rogue AI Actors?", author: 'Ankush Das', date: '26th June, 2026' },
  { image: '/images/news-allhome.jpg', category: 'NEWS', title: "PharmEasy Cofounders' Home Interiors Startup AllHome Raises ₹200 Cr", author: 'Gaurav B.', date: '26th June, 2026' },
  { image: '/images/brandlabs-smartworks.jpg', category: 'NEWS', title: "How Let's Try Tripled Revenue To Cross ₹200 Cr In A Year", author: 'Founder Diary', date: '25th June, 2026' },
];

const fundingData = [
  { name: 'Tringbox', letter: 'T', founded: '2024', stage: 'Seed', totalFunding: '$530.1K+' },
  { name: 'INFLUISH', letter: 'I', founded: '2022', stage: 'Pre-Seed', totalFunding: 'Undisclosed' },
  { name: 'Xtovia', letter: 'X', founded: '2024', stage: 'Pre-Seed', totalFunding: '$731.5K+' },
  { name: 'CREST', letter: 'C', founded: '2025', stage: 'Pre-Seed', totalFunding: '$3.1Mn+' },
  { name: 'Foodatories', letter: 'F', founded: '2024', stage: 'Series B', totalFunding: '$5.2Mn+' },
];

// Premium Inline Funding Card Component
function PremiumFundingCard({ item }: { item: any }) {
  return (
    <div className="group relative bg-white border border-transparent hover:border-gray-100 hover:shadow-[0_8px_20px_rgba(0,0,0,0.03)] rounded-xl p-4 transition-all duration-300 cursor-pointer overflow-hidden">
      
      {/* Decorative vertical accent line on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E31E24] scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100 origin-center transition-all duration-300"></div>

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3">
          {/* Avatar with color-flip interaction */}
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-[15px] font-bold text-[#E31E24] group-hover:bg-[#E31E24] group-hover:text-white transition-colors duration-300 shadow-sm">
            {item.letter}
          </div>
          <span className="text-[15px] font-bold text-gray-900 group-hover:text-[#E31E24] transition-colors duration-300">
            {item.name}
          </span>
        </div>
        
        {/* Animated Link */}
        <div className="flex items-center text-[#E31E24] text-xs font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Profile <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </div>
      </div>
      
      {/* Dashboard-style data grid */}
      <div className="grid grid-cols-3 gap-2 pl-[48px] relative z-10 divide-x divide-gray-100">
        <div className="pr-2">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Founded</span>
          <p className="font-semibold text-gray-900 text-xs">{item.founded}</p>
        </div>
        <div className="px-3">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Stage</span>
          <p className="font-semibold text-gray-900 text-xs">{item.stage}</p>
        </div>
        <div className="pl-3">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Raised</span>
          <p className="font-bold text-[#E31E24] text-xs">{item.totalFunding}</p>
        </div>
      </div>
    </div>
  );
}

export function MoreNewsSection() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}} />

      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: More Articles */}
          <div className="lg:col-span-8 flex flex-col">
            
            <div className="flex items-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0ms' }}>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">More Top Stories</h2>
              <div className="h-px bg-gray-200 flex-grow ml-4"></div>
            </div>

            <div className="flex flex-col gap-8 lg:gap-10">
              {articles.map((article, idx) => (
                <div 
                  key={idx} 
                  className="animate-fade-up"
                  style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                >
                  <ArticleCardHorizontal {...article} />
                </div>
              ))}
            </div>
            
            {/* Load More Button (Optional addition for realism) */}
            <div className="mt-10 flex justify-center animate-fade-up" style={{ animationDelay: '500ms' }}>
              <button className="px-6 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors duration-300">
                Load More Articles
              </button>
            </div>
          </div>

          {/* Right Column: Premium Sticky Funding Widget */}
          <div className="lg:col-span-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
            
            <div className="sticky top-24">
              <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-2 relative overflow-hidden group/widget">
                
                {/* Inner white container for the card-in-card premium feel */}
                <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-5 lg:p-6 h-full w-full">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#E31E24]" strokeWidth={2.5} />
                        Latest Funding
                      </h3>
                    </div>
                    
                    {/* Consistent Datalabs Badge */}
                    <div className="flex flex-col items-end gap-1 bg-gray-50 border border-gray-100 px-2 py-1.5 rounded-md">
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">Powered by</span>
                      <div className="flex items-center gap-1.5">
                        <Image src="/images/logo2.png" alt="Datalabs" width={10} height={10} className="w-2.5 h-2.5 opacity-80" />
                        <span className="text-[9px] font-extrabold text-[#E31E24] tracking-wide leading-none">DATALABS</span>
                      </div>
                    </div>
                  </div>

                  {/* Startups List */}
                  <div className="flex flex-col gap-1 mb-6">
                    {fundingData.map((item, idx) => (
                      <PremiumFundingCard key={idx} item={item} />
                    ))}
                  </div>

                  {/* Interactive Dashboard Button */}
                  <button className="relative w-full overflow-hidden bg-white border-2 border-gray-900 text-gray-900 font-bold text-sm tracking-wide py-3.5 rounded-xl transition-all duration-300 hover:bg-gray-900 hover:text-white group/btn flex items-center justify-center gap-2">
                    View Startup Tracker
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>

                </div>
              </div>
            </div>

          </div>
          
        </div>
      </section>
    </>
  );
}