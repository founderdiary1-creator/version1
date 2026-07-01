'use client';

import { useAuth } from '@/hooks/useAuth';
import { ArticleCardVertical } from '@/components/features/ArticleCardVertical';
import { Lock, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const premiumArticles = [
  { image: '/images/indepth-kunal-shah.jpg', category: 'PREMIUM', title: 'Kunal Shah & The WhatsApp Acid Test — Full Analysis', author: 'Debarghya S.', date: '28th June, 2026' },
  { image: '/images/indepth-financial-tracker.jpg', category: 'PREMIUM', title: 'FY26 Financial Tracker: Complete Data Deep Dive', author: 'Anjali J.', date: '27th June, 2026' },
  { image: '/images/indepth-irdai.jpg', category: 'PREMIUM', title: "IRDAI Reform: Impact Analysis On Insurance Startups", author: 'Lokesh C.', date: '25th June, 2026' },
  { image: '/images/indepth-meesho.jpg', category: 'PREMIUM', title: "Meesho's ₹202 Cr Question — Investor Perspective", author: 'Bismah M.', date: '25th June, 2026' },
];

export default function PlusPage() {
  const { user, isSubscriber, loading } = useAuth();
  useScrollReveal();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isSubscriber) {
    return (
      <div className="bg-white min-h-screen">
        {/* Premium Gate / Paywall */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 to-gray-900/80" />
          <div className="absolute inset-0 bg-[url('/images/hero-kunal-shah.jpg')] bg-cover bg-center opacity-20" />
          <div className="relative max-w-[800px] mx-auto px-4 sm:px-6 py-24 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-[#E31E24] p-4 rounded-2xl">
                <Crown size={40} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Founder Diary <span className="text-[#E31E24]">Plus</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
              Unlock exclusive data-driven deep dives, financial trackers, and premium analysis on India&apos;s startup ecosystem.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
              {['Exclusive Deep Dives', 'Financial Trackers', 'Early Access'].map((feature) => (
                <div key={feature} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-white font-medium text-sm">{feature}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="bg-[#E31E24] text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-[#C41A20] transition-colors flex items-center gap-2"
              >
                Subscribe Now <ArrowRight size={18} />
              </Link>
              <Link
                href="/auth/login"
                className="bg-white/10 text-white font-medium px-8 py-3.5 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                Already a member? Login
              </Link>
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
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Image src="/images/logo2.png" alt="Founder Diary" width={32} height={32} className="h-8 w-8 object-contain" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Founder Diary <span className="text-[#E31E24]">Plus</span>
          </h1>
        </div>
        <p className="text-gray-500 mb-8">Exclusive premium content for subscribers</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {premiumArticles.map((article, idx) => (
            <div key={idx} className="scroll-reveal" style={{ transitionDelay: `${idx * 80}ms` }}>
              <ArticleCardVertical {...article} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
