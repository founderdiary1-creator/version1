'use client';

import { Mail, ArrowRight } from 'lucide-react';

export function NewsletterBanner() {
  return (
    <section className="relative bg-[#E31E24] py-16 sm:py-20 overflow-hidden">
      
      {/* Subtle decorative background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent)]" />
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="animate-fade-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Mail size={16} className="text-white" />
              </div>
              <span className="text-white/90 font-bold tracking-[0.2em] text-[10px] uppercase">Daily Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3">
              The Daily Pulse for Founders &amp; Investors.
            </h2>
            <p className="text-white/80 text-base sm:text-lg max-w-[450px]">
              Get the most critical news, funding updates, and deep-dive analysis delivered directly to your inbox every morning. 
            </p>
          </div>

          {/* Form Content */}
          <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your business email"
                  className="flex-1 px-5 py-4 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
                />
                <button className="group relative bg-[#1A1A1A] text-white font-bold px-8 py-4 rounded-xl text-sm transition-all duration-300 hover:bg-black hover:shadow-xl flex items-center justify-center gap-2">
                  <span>SUBSCRIBE</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
              <div className="px-2 pt-3 pb-1">
                <p className="text-white/50 text-[10px] font-medium tracking-wide uppercase text-center sm:text-left">
                  Join 50,000+ top operators. No spam, ever.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}