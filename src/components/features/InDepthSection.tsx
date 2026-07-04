'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ArticleCardVertical } from './ArticleCardVertical';
import { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';

interface InDepthSectionProps {
    articles: any[];
    isLoading: boolean;
}
export function InDepthSection({ articles, isLoading }: InDepthSectionProps) {
    const swiperRef = useRef<SwiperType | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            {/* Premium Swiper Customization (Contained Styles Only) */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .premium-swiper-contained {
          padding-top: 0.5rem !important;
          padding-bottom: 3.5rem !important;
          /* Swiper naturally uses overflow: hidden to clip slides right at its container edge */
        }
        .premium-swiper-contained .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.4);
          opacity: 1;
          transition: all 0.3s ease;
          width: 8px;
          height: 8px;
        }
        .premium-swiper-contained .swiper-pagination-bullet-active {
          background: #ffffff;
          width: 24px;
          border-radius: 4px;
        }
      `}} />

            <section className="bg-gradient-to-br from-[#E31E24] via-[#cc181f] to-[#990f13] py-16 sm:py-20">

                {/* Core Layout Container: Everything is strictly bound within max-w-[1200px] */}
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2.5">
                                <Sparkles className="w-3.5 h-3.5 text-white/80" />
                                <span className="text-white/90 font-bold tracking-[0.15em] text-[11px] uppercase">Premium Analysis</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                                Founder Diary In-Depth
                            </h2>
                        </div>

                        {/* Navigation Cluster */}
                        <div className="flex items-center gap-1 bg-black/15 p-1 rounded-full backdrop-blur-md border border-white/10 shadow-inner w-fit">
                            <button
                                onClick={() => swiperRef.current?.slidePrev()}
                                disabled={isBeginning}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isBeginning
                                        ? 'opacity-30 cursor-not-allowed text-white'
                                        : 'bg-transparent hover:bg-white text-white hover:text-[#E31E24]'
                                    }`}
                                aria-label="Previous slide"
                            >
                                <ChevronLeft size={20} strokeWidth={2.5} />
                            </button>

                            <div className="w-[1px] h-5 bg-white/10 mx-0.5"></div>

                            <button
                                onClick={() => swiperRef.current?.slideNext()}
                                disabled={isEnd}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isEnd
                                        ? 'opacity-30 cursor-not-allowed text-white'
                                        : 'bg-transparent hover:bg-white text-white hover:text-[#E31E24]'
                                    }`}
                                aria-label="Next slide"
                            >
                                <ChevronRight size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Carousel Track: Clips completely clean at the container borders */}
                    <div className="relative">
                        <Swiper
                            modules={[Pagination]}
                            className="premium-swiper-contained"
                            slidesPerView={1}
                            spaceBetween={16}
                            grabCursor={true}
                            pagination={{ clickable: true }}
                            breakpoints={{
                                520: { slidesPerView: 2, spaceBetween: 20 },
                                768: { slidesPerView: 2.5, spaceBetween: 24 },
                                1024: { slidesPerView: 3, spaceBetween: 24 },
                                1200: { slidesPerView: 4, spaceBetween: 24 }, // Flawlessly fits exactly 4 clean cards inside the 1200px limit on screens
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
                            {articles.map((article, idx) => (
                                <SwiperSlide key={idx} className="h-auto">
                                    {/* Outer container layer to prevent shadow cutting clipping bugs */}
                                    <div className="py-1.5 h-full">
                                        <ArticleCardVertical {...article} />
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