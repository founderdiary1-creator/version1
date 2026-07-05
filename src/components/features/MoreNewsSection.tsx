'use client';

import { ArticleCardHorizontal } from './ArticleCardHorizontal';

export function MoreNewsSection({ articles = [] }: { articles: any[] }) {
    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}} />

            <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-16">

                <div className="grid grid-cols-1 gap-16">

                    {/* Left Column: More Articles */}
                    <div className="lg:col-span-8 flex flex-col">

                        <div className="flex items-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0ms' }}>
                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">More Top Stories</h2>
                            <div className="h-px bg-gray-200 flex-grow ml-4"></div>
                        </div>

                        <div className="flex flex-col gap-8 lg:gap-10">
                            {articles.map((article, idx) => (
                                <div
                                    key={idx}
                                    className="animate-fade-up"
                                    style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                                >
                                    <ArticleCardHorizontal {...article} />
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            </section>
        </>
    );
}