'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight, ArrowRight, TrendingUp } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

// Fake Data
const fundingData = [
  { name: 'Tringbox', letter: 'T', founded: '2024', stage: 'Seed', totalFunding: '$530.1K+' },
  { name: 'INFLUISH', letter: 'I', founded: '2022', stage: 'Pre-Seed', totalFunding: 'Undisclosed' },
  { name: 'Xtovia', letter: 'X', founded: '2024', stage: 'Pre-Seed', totalFunding: '$731.5K+' },
  { name: 'CREST', letter: 'C', founded: '2025', stage: 'Pre-Seed', totalFunding: '$3.1Mn+' },
  { name: 'Foodatories', letter: 'F', founded: '2024', stage: 'Series B', totalFunding: '$5.2Mn+' },
  { name: 'Lickicious', letter: 'L', founded: '2023', stage: 'Angel', totalFunding: '$52.8K+' },
];

export function FundingRoundsSection() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="bg-[#E31E24] py-16 md:py-20 scroll-reveal relative">
      
      {/* Strict Container Boundary - Overflow hidden happens AT the Swiper level */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white/20 p-1 rounded backdrop-blur-sm border border-white/30">
                <TrendingUp size={14} className="text-white" />
              </div>
              <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">
                DataLabs Intelligence
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Recent Capital Flow
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <Link 
              href="/data-labs" 
              className="hidden sm:flex items-center gap-2 text-xs font-bold text-white hover:text-white/80 uppercase tracking-widest transition-colors group"
            >
              Access Terminal
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="w-px h-8 bg-white/30 hidden sm:block" />

            {/* Navigation Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="w-10 h-10 rounded-full bg-white text-[#E31E24] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="w-10 h-10 rounded-full bg-white text-[#E31E24] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container (Strictly Bounded) */}
        <div className="relative rounded-xl">
          <Swiper
            modules={[Navigation, FreeMode]}
            slidesPerView="auto"
            spaceBetween={20}
            freeMode={true}
            grabCursor={true}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            // We REMOVED !overflow-visible. The cards will perfectly clip at the edge of this container.
            className="w-full pb-4" 
          >
            {fundingData.map((item, idx) => (
              <SwiperSlide key={idx} className="!w-[300px] sm:!w-[340px]">
                
                {/* Premium Ticket Card Design */}
                <Link href="/data-labs" className="block w-full outline-none">
                  <div className="group flex h-[140px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden cursor-pointer">
                    
                    {/* LEFT SECTION: Company Details */}
                    <div className="flex-1 p-5 flex flex-col justify-between relative z-10 bg-white">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#E31E24] transition-colors truncate pr-2">
                          {item.name}
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                          Est. {item.founded}
                        </p>
                      </div>
                      <div className="inline-block mt-auto">
                        <span className="inline-flex px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#E31E24] bg-[#E31E24]/10 rounded border border-[#E31E24]/20">
                          {item.stage}
                        </span>
                      </div>
                    </div>

                    {/* THE TICKET TEAR (Dashed Line & Cutouts) */}
                    <div className="w-px border-l-2 border-dashed border-gray-200 relative my-3 z-20">
                      {/* Top Cutout */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#E31E24] shadow-inner" />
                      {/* Bottom Cutout */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#E31E24] shadow-inner" />
                    </div>

                    {/* RIGHT SECTION: Funding Stub */}
                    <div className="w-28 sm:w-32 bg-[#F8F9FA] p-4 flex flex-col justify-center items-center text-center relative z-10 transition-colors group-hover:bg-gray-50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Raised
                      </p>
                      <p className={`font-mono font-bold ${item.totalFunding === 'Undisclosed' ? 'text-gray-500 text-xs' : 'text-gray-900 text-lg sm:text-xl'}`}>
                        {item.totalFunding}
                      </p>

                      {/* Micro-interaction: Sliding Arrow on Hover */}
                      <div className="absolute bottom-3 right-3 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
                        <ArrowRight size={16} className="text-[#E31E24]" />
                      </div>
                    </div>

                  </div>
                </Link>
                
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link 
            href="/data-labs" 
            className="inline-flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest transition-colors px-6 py-3 border border-white/30 rounded-full hover:bg-white hover:text-[#E31E24]"
          >
            Access Terminal <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}