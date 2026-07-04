'use client';

import Link from 'next/link';
import { ArticleCardHorizontal } from './ArticleCardHorizontal';
import { ArrowRight, ChevronRight, BarChart3 } from 'lucide-react';
import Image from 'next/image';

const articles = [
    { image: '/images/news-alienkind.jpg', category: 'ECOMMERCE', title: 'Gen Z-Focused Cafe Chain Alienkind Bags $3.2 Mn To Expand Footprint', author: 'Shrishti B.', date: '26th June, 2026' },
    { image: '/images/news-blue-move.jpg', category: 'NEWS', title: "Hyundai, TVS Pilot EV Ride-Hailing App 'Blue Move' In Delhi NCR", author: 'Shrishti B.', date: '26th June, 2026' },
    { image: '/images/news-foxconn.jpg', category: 'NEWS', title: 'iPhone Maker Foxconn Invests $37.2 Mn In India Subsidiary', author: 'Anjali J.', date: '26th June, 2026' },
    { image: '/images/news-daily-brief.jpg', category: 'NEWS', title: "Amazon's India Blitz, IRDAI's Overhaul & More", author: 'Team Founder Diary', date: '26th June, 2026' },
];

const investors = [
    { name: 'Accel', letter: 'A', portfolio: 902, total: '$81.8Bn+' },
    { name: 'Blume Ventures', letter: 'B', portfolio: 237, total: '$4.1Bn+' },
    { name: 'Venture Catalysts', letter: 'V', portfolio: 279, total: '$1.1Bn+' },
    { name: 'Elevation Capital', letter: 'E', portfolio: 159, total: '$6.7Bn+' },
    { name: 'Chiratae Ventures', letter: 'C', portfolio: 138, total: '$4.2Bn+' },
];

// Premium Investor Row
function PremiumInvestorRow({ name, letter, portfolio, total }: any) {
    return (
        <div className="group flex items-center justify-between py-4 border-b border-gray-50 last:border-0 cursor-pointer transition-all duration-300">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center font-bold text-gray-400 group-hover:bg-[#E31E24] group-hover:text-white transition-all duration-300">
                    {letter}
                </div>
                <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-gray-900 group-hover:text-[#E31E24] transition-colors">{name}</span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase">{portfolio} Portfolios</span>
                </div>
            </div>
            <div className="text-right">
                <div className="text-[13px] font-extrabold text-gray-900">{total}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">AUM</div>
            </div>
        </div>
    );
}

export function MoreArticlesSection({ articles = [] }: { articles: any[] }) {
    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
      `}} />

            <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16 sm:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* Main Feed */}
                    <div className="lg:col-span-8">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 animate-fade-up">More Top Stories</h2>
                        <div className="space-y-8 lg:space-y-10">
                            {articles.map((article, idx) => (
                                <div key={idx} className="animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <ArticleCardHorizontal {...article} />
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: '400ms' }}>
                            <Link href="/news" className="group inline-flex items-center gap-2 bg-transparent border border-gray-900 text-gray-900 font-bold px-8 py-3.5 rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300">
                                Load More Articles
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
                        <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">

                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-[#E31E24]" />
                                    Active Investors
                                </h3>
                                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">
                                    <Image src="/images/logo2.png" alt="Datalabs" width={10} height={10} />
                                    <span className="text-[9px] font-bold text-[#E31E24] uppercase tracking-wider">Datalabs</span>
                                </div>
                            </div>

                            {/* Investor List */}
                            <div className="mb-6">
                                {investors.map((investor, idx) => (
                                    <PremiumInvestorRow key={idx} {...investor} />
                                ))}
                            </div>

                            {/* Action */}
                            <button className="w-full flex items-center justify-center gap-2 bg-[#E31E24] text-white font-bold text-sm py-3.5 rounded-xl hover:bg-[#C41A20] transition-colors shadow-lg shadow-red-500/20">
                                View Investor Database
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}