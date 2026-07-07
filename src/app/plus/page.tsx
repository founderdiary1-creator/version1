'use client';

import { useAuth } from '@/hooks/useAuth';
import { ArticleCardVertical } from '@/components/features/ArticleCardVertical';
import { Lock, Crown, ArrowRight, X, Sparkles } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const premiumArticles = [
  { image: '/images/indepth-kunal-shah.jpg', category: 'PREMIUM', title: 'Kunal Shah & The WhatsApp Acid Test — Full Analysis', author: 'Debarghya S.', date: '28th June, 2026' },
  { image: '/images/indepth-financial-tracker.jpg', category: 'PREMIUM', title: 'FY26 Financial Tracker: Complete Data Deep Dive', author: 'Anjali J.', date: '27th June, 2026' },
  { image: '/images/indepth-irdai.jpg', category: 'PREMIUM', title: "IRDAI Reform: Impact Analysis On Insurance Startups", author: 'Lokesh C.', date: '25th June, 2026' },
  { image: '/images/indepth-meesho.jpg', category: 'PREMIUM', title: "Meesho's ₹202 Cr Question — Investor Perspective", author: 'Bismah M.', date: '25th June, 2026' },
];

export default function PlusPage() {
  const { user, isSubscriber, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  useScrollReveal();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

    return (
      <div className="bg-white min-h-screen">
        {/* Premium Gate / Paywall */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 to-gray-900/80" />
          <div className="absolute inset-0 bg-[url('/images/hero-kunal-shah.jpg')] bg-cover bg-center opacity-20" />
          <div className="relative max-w-[800px] mx-auto px-4 sm:px-6 py-24 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-[#E31E24] p-4 rounded-2xl shadow-xl shadow-red-900/30">
                <Crown size={40} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Founder Diary <span className="text-[#E31E24]">Plus</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto font-medium">
              Unlock exclusive data-driven deep dives, financial trackers, and premium analysis on India&apos;s startup ecosystem.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
              {['Exclusive Deep Dives', 'Financial Trackers', 'Early Access'].map((feature) => (
                <div key={feature} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-colors hover:bg-white/15">
                  <p className="text-white font-semibold text-sm tracking-wide">{feature}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-[#E31E24] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#C41A20] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
              >
                Subscribe Now <ArrowRight size={18} />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-white/10 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                Already a member?
              </button>
            </div>
          </div>
        </div>

        {/* Preview of locked content */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lock size={20} className="text-[#E31E24]" /> Premium Content Preview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-60 pointer-events-none select-none">
            {premiumArticles.map((article, idx) => (
              <div key={idx} className="relative">
                <ArticleCardVertical {...article} />
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] rounded-lg flex items-center justify-center">
                  <Lock size={24} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Coming Soon Modal Layer */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              {/* Dark Translucent Backdrop Blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />

              {/* State of the Art Modal Content Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                className="relative bg-white max-w-md w-full rounded-[2rem] p-8 shadow-2xl border border-gray-100 z-10 overflow-hidden text-center"
              >
                {/* Subtle Geometric Background Decorative Accent */}
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-32 h-32 bg-red-50 rounded-full blur-2xl pointer-events-none opacity-60" />

                {/* Close Trigger Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>

                {/* Status Indicator Icon */}
                <div className="mx-auto w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
                  <Sparkles size={26} className="text-[#E31E24]" />
                </div>

                {/* Typography and Brand Messages */}
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
                  Coming Soon
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 px-2">
                  We are currently perfecting the premium infrastructure for <span className="font-bold text-gray-800">Founder Diary Plus</span>. Gateways, automated analytics tracking, and customized operator payloads will be fully deployed shortly.
                </p>

                {/* Primary Got It Call to Action Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors duration-300 text-sm tracking-wide shadow-lg shadow-gray-900/10"
                >
                  Got It, Thanks!
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );

  
}