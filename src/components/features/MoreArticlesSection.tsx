'use client';

import Link from 'next/link';
import { ArticleCardHorizontal } from './ArticleCardHorizontal';
import { ArrowRight } from 'lucide-react';



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
                <div className="grid grid-cols-1 gap-16">

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

                        {/* <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: '400ms' }}>
                            <Link href="/news" className="group inline-flex items-center gap-2 bg-transparent border border-gray-900 text-gray-900 font-bold px-8 py-3.5 rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300">
                                Load More Articles
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div> */}
                    </div>

                </div>
            </section>
        </>
    );
}