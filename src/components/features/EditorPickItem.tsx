'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface EditorPickItemProps {
  number: number;
  title: string;
  author: string;
  date: string;
  readTime: string;
  slug: string;
}

export function EditorPickItem({ number, title, author, date, readTime, slug }: EditorPickItemProps) {
  return (
    <Link 
      href={`/article/${slug}`} 
      className="group relative flex items-start gap-4 md:gap-5 py-5 border-b border-gray-100 last:border-0 cursor-pointer overflow-hidden transition-all duration-300 px-2 -mx-2 rounded-xl"
    >
      {/* Subtle Background Highlight on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 rounded-xl" />

      {/* Animated Numeral */}
      <div className="relative flex-shrink-0 w-8 md:w-12 pt-0.5">
        <span className="block text-[32px] md:text-[40px] font-black text-transparent bg-clip-text bg-gray-200 group-hover:bg-[#E31E24] transition-colors duration-500 leading-none tracking-tighter">
          {String(number).padStart(2, '0')}
        </span>
      </div>

      {/* Content Block */}
      <div className="flex-1 pr-8 relative z-10">
        <h4 className="text-[15px] md:text-[17px] font-extrabold text-gray-900 leading-snug mb-2.5 group-hover:text-[#E31E24] transition-colors duration-300">
          {title}
        </h4>
        
        {/* Refined Meta Data */}
        <div className="flex flex-wrap items-center text-[10px] md:text-[11px] font-medium text-gray-400 uppercase tracking-wider gap-2">
          <span className="text-gray-900 font-bold">By {author}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{date}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-[#E31E24] opacity-80">{readTime}</span>
        </div>
      </div>

      {/* Micro-interaction: Slide-in Arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]">
        <div className="w-8 h-8 rounded-full bg-white shadow-[0_4px_12px_rgba(227,30,36,0.15)] flex items-center justify-center border border-red-50">
          <ArrowUpRight className="w-4 h-4 text-[#E31E24]" strokeWidth={2.5} />
        </div>
      </div>
    </Link>
  );
}