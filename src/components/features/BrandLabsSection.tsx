'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Info, Layers } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';

const brandLabsArticles = [
  { image: '/images/brandlabs-smartworks.jpg', title: 'How Smartworks Turned Managed Workspaces Into An Enterprise Play', date: '23rd June, 2026' },
  { image: '/images/brandlabs-shipway.jpg', title: "How Shipway Is Using AI To Drive Post-Purchase Efficiency For India's D2C Brands...", date: '22nd June, 2026' },
  { image: '/images/brandlabs-oracle.jpg', title: 'How Startups Are Rebuilding Their Cloud Stack For Profitability, Scale', date: '18th June, 2026' },
  { image: '/images/brandlabs-ai-summit.jpg', title: 'How Enterprises Are Re-Architecting Data For The Agentic AI Era', date: '15th June, 2026' },
  { image: '/images/hero-rocket.jpg', title: 'Rocket: Building The Future Of Vibe Coding In India', date: '10th June, 2026' },
  { image: '/images/news-byjus.jpg', title: "BYJU'S: The Road To Recovery And Lessons For EdTech", date: '5th June, 2026' },
];

export function BrandLabsSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <>
      {/* Premium Pagination & Custom Transitions */}
      <style dangerouslySetInnerHTML={{__html: `
        .brandlabs-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.35);
          opacity: 1;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          width: 6px;
          height: 6px;
        }
        .brandlabs-swiper .swiper-pagination-bullet-active {
          background: #ffffff;
          width: 20px;
          border-radius: 4px;
        }
        .brandlabs-swiper {
          padding-top: 0.5rem !important;
          padding-bottom: 3.5rem !important;
        }
      `}} />

      <section className="bg-gradient-to-br from-[#E31E24] via-[#cb171d] to-[#960a0e] py-16 sm:py-20 relative overflow-hidden">
        
        {/* Subtle background tech grid layout pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        {/* Main Layout Container: Strictly bounds elements within the 1200px column boundary */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Layers className="w-3.5 h-3.5 text-white/70" />
                <span className="text-white/80 font-bold tracking-[0.2em] text-[10px] uppercase">Insights &amp; Innovation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Founder Diary BrandLabs
              </h2>
            </div>

            {/* Glassmorphic Control Pod */}
            <div className="flex items-center gap-1 bg-black/15 p-1 rounded-full backdrop-blur-md border border-white/10 w-fit">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={isBeginning}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isBeginning 
                    ? 'opacity-30 cursor-not-allowed text-white' 
                    : 'bg-transparent hover:bg-white text-white hover:text-[#E31E24] shadow-sm'
                }`}
                aria-label="Previous insight"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              
              <div className="w-[1px] h-5 bg-white/10 mx-0.5" />

              <button
                onClick={() => swiperRef.current?.slideNext()}
                disabled={isEnd}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isEnd 
                    ? 'opacity-30 cursor-not-allowed text-white' 
                    : 'bg-transparent hover:bg-white text-white hover:text-[#E31E24] shadow-sm'
                }`}
                aria-label="Next insight"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Slider Row: Explicit native clipping inside your layout column bounds */}
          <div className="relative">
            <Swiper
              modules={[Pagination]}
              className="brandlabs-swiper"
              slidesPerView={1}
              spaceBetween={16}
              grabCursor={true}
              pagination={{ clickable: true }}
              breakpoints={{
                480: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 2.5, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
                1200: { slidesPerView: 4, spaceBetween: 24 }, // Exact container alignment on large viewports
              }}
              onSwiper={(swiper) => { 
                swiperRef.current = swiper;
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
            >
              {brandLabsArticles.map((article, idx) => (
                <SwiperSlide key={idx} className="h-auto">
                  <div className="py-1.5 h-full">
                    
                    {/* Upgraded Premium Card Context */}
                    <article className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_35px_rgba(0,0,0,0.14)] hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer">
                      
                      {/* Image Frame */}
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-50 shrink-0">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        
                        {/* Native Logo Safe-Watermark Container */}
                        <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md rounded-full p-2 shadow-sm border border-gray-100/50 transition-transform duration-500 group-hover:scale-105 z-10">
                          <Image 
                            src="/images/logo2.png" 
                            alt="Founder Diary" 
                            width={14} 
                            height={14} 
                            className="h-3.5 w-3.5 object-contain opacity-100" 
                          />
                        </div>
                      </div>

                      {/* Content Block */}
                      <div className="flex flex-col flex-grow p-5 lg:p-6">
                        
                        {/* Refined BrandLabs Badge Layout */}
                        <div className="mb-4">
                          <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-[#E31E24] text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-md transition-colors duration-300 group-hover:bg-red-50 group-hover:border-red-100">
                            BRANDLABS 
                            <Info size={11} strokeWidth={2.5} className="text-gray-400 group-hover:text-[#E31E24] transition-colors" />
                          </span>
                        </div>

                        {/* Title text */}
                        <h3 className="text-sm lg:text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 mb-5 transition-colors duration-300 group-hover:text-[#E31E24]">
                          {article.title}
                        </h3>

                        {/* Date info footer alignment */}
                        <div className="mt-auto pt-4 border-t border-gray-50 text-[11px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-300 group-hover:border-gray-100">
                          <span>{article.date}</span>
                        </div>

                      </div>
                    </article>

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          
        </div>
      </section>
    </>
  );
}