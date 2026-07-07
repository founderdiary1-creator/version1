'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SearchArticle } from '@/app/actions/search.actions';

export default function SearchResultCard({ 
  article, 
  index 
}: { 
  article: SearchArticle; 
  index: number;
}) {
  // Format date to be elegant (e.g., "June 25, 2026")
  const date = new Date(article.published_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    // Staggered animation entrance based on index
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_35px_rgba(0,0,0,0.08)] transition-all duration-500"
    >
      <Link href={`/article/${article.slug}`} className="flex flex-col h-full outline-none">
        {/* Image Container with inner scale on hover */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-50 shrink-0">
          <Image
            src={article.featured_image || '/images/og-default.jpg'}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-transparent" />
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-grow p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#E31E24] bg-red-50 px-2.5 py-1 rounded">
              {article.category?.name || 'News'}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-3 transition-colors duration-300 group-hover:text-[#E31E24]">
            {article.title}
          </h3>
          
          <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-medium leading-relaxed">
            {article.summary}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
             <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
               {date}
             </span>
             {/* Micro-interaction arrow */}
             <svg 
                className="w-4 h-4 text-gray-300 transition-all duration-300 group-hover:text-[#E31E24] group-hover:translate-x-1" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
             >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
             </svg>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}