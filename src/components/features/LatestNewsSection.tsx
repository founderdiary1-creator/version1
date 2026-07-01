'use client';

import { ArticleCardHorizontal } from './ArticleCardHorizontal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import Image from 'next/image';

const articles = [
  { image: '/images/news-bharat-taxi.jpg', category: 'NEWS', title: 'Bharat Taxi To Expand To 500 Cities In 2 Years: HM Amit Shah', author: 'Shrishti B.', date: '27th June, 2026' },
  { image: '/images/news-tech-stocks.jpg', category: 'NEWS', title: 'New-Age Tech Stocks: Meesho, Smartworks Rally; ideaForge, EaseMyTrip Tumble', author: 'Akshit P.', date: '27th June, 2026' },
  { image: '/images/news-infoedge.jpg', category: 'CONSUMER SERVICES', title: 'Info Edge Appoints Former Bennett Coleman CFO Himanshu Agarwal As Finance Chief', author: 'Anjali J.', date: '27th June, 2026' },
  { image: '/images/news-telegram.jpg', category: 'NEWS', title: 'After NEET Row, NCB Flags Telegram As Top Platform For Drug Advertising', author: 'Srishti B.', date: '27th June, 2026' },
];

export function LatestNewsSection() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 overflow-hidden">
      {/* Premium subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-transparent to-transparent -z-10 blur-3xl" />

      <div className="mb-10">
        <SectionHeader title="Latest From Founder Diary" action={{ label: 'SEE ALL', href: '/news' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: News Articles */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {articles.map((article, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 transition-all duration-500 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 hover:border-gray-200"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <ArticleCardHorizontal {...article} />
              
              {/* Subtle hover gradient indicator on the border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#E31E24]/10 pointer-events-none transition-colors duration-500" />
            </div>
          ))}
        </div>

        {/* Right Column: Datalabs Promotional Card */}
        <div className="lg:col-span-4 relative">
          {/* Sticky positioning allows the card to follow the user as they scroll through the news */}
          <div className="sticky top-24 w-full group overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#E31E24] via-[#D01820] to-[#A31015] p-8 text-center shadow-2xl shadow-[#E31E24]/20 transition-all duration-500 hover:shadow-[#E31E24]/40 border border-white/10">
            
            {/* Animated background glowing orbs for depth */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl transition-transform duration-700 ease-out group-hover:scale-150 group-hover:bg-white/20" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-black/10 blur-2xl" />

            <div className="relative z-10 flex h-full min-h-[380px] flex-col items-center justify-center">
              
              {/* Glassmorphism Badge */}
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full bg-white/10 px-5 py-2.5 backdrop-blur-md border border-white/20 shadow-inner transition-transform duration-300 group-hover:-translate-y-1">
                <Image 
                  src="/images/logo2.png" 
                  alt="Founder Diary" 
                  width={20} 
                  height={20} 
                  className="h-5 w-auto object-contain brightness-0 invert" 
                />
                <span className="text-white text-xs font-bold tracking-widest uppercase">
                  Datalabs
                </span>
              </div>

              {/* Typography hierarchy */}
              <h3 className="text-white text-3xl sm:text-4xl font-bold leading-tight mb-4 tracking-tight">
                India&apos;s #1 <br/>
                <span className="text-white/80 font-light text-2xl sm:text-3xl">Startup Intelligence</span>
              </h3>
              
              <p className="text-[#ffccd0] text-sm mb-10 max-w-[220px] mx-auto font-medium leading-relaxed">
                Data-driven insights tailored for high-growth enterprises.
              </p>

              {/* Premium Button with animated arrow */}
              <button className="group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-bold text-[#E31E24] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#E31E24]">
                <span>Explore Platform</span>
                <svg 
                  className="w-4 h-4 transition-transform duration-300 ease-out group-hover/btn:translate-x-1.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}