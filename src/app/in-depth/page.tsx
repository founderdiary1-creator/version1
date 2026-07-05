'use client';

import { ArticleCardVertical } from '@/components/features/ArticleCardVertical';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const featuredArticles = [
  { image: '/images/indepth-kunal-shah.jpg', category: 'IN-DEPTH', title: 'Kunal Shah & The WhatsApp Acid Test', author: 'Debarghya S.', date: '28th June, 2026' },
  { image: '/images/indepth-financial-tracker.jpg', category: 'IN-DEPTH', title: 'FY26 Financial Tracker: Tracking The Financial Performance Of Indian Startups', author: 'Anjali J.', date: '27th June, 2026' },
  { image: '/images/indepth-irdai.jpg', category: 'IN-DEPTH', title: "IRDAI's Reform Push That Can Upend Insurance Startups", author: 'Lokesh C.', date: '25th June, 2026' },
  { image: '/images/indepth-meesho.jpg', category: 'ECOMMERCE', title: "Meesho's ₹202 Cr Question: Can It Crack India's Kirana Code?", author: 'Bismah M.', date: '25th June, 2026' },
  { image: '/images/hero-kunal-shah.jpg', category: 'IN-DEPTH', title: 'The Outline: Kunal Shah On Building CRED', author: 'Debarghya S.', date: '28th June, 2026' },
  { image: '/images/hero-financial-tracker.jpg', category: 'IN-DEPTH', title: 'Indian Startup Financials: Q1 FY26 Report', author: 'Anjali J.', date: '27th June, 2026' },
  { image: '/images/hero-rocket.jpg', category: 'ENTERPRISE TECH', title: 'Exclusive: Vibe Coding Startup Rocket Eyes Fresh Funding', author: 'Debarghya S.', date: '27th June, 2026' },
  { image: '/images/news-satcom.jpg', category: 'NEWS', title: 'India Drops 20% Local Sourcing Rule, Keeps Security Guardrails For Satcom', author: 'Shrishti B.', date: '26th June, 2026' },
];

export default function FeaturesPage() {
  useScrollReveal();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Features & In-Depth</h1>
        <p className="text-gray-500 mb-8">Data-driven deep dives into India&apos;s startup ecosystem</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article, idx) => (
            <div key={idx} className="scroll-reveal" style={{ transitionDelay: `${idx * 80}ms` }}>
              <ArticleCardVertical {...article} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-[#E31E24] text-white font-medium px-8 py-3 rounded hover:bg-[#C41A20] transition-colors">
            LOAD MORE
          </button>
        </div>
      </div>
    </div>
  );
}
