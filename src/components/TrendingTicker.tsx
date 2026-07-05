'use client';

import Link from 'next/link';

interface TrendingTickerProps {
  tags: string[];
}

export function TrendingTicker({ tags }: TrendingTickerProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-2 sm:gap-3 flex-nowrap whitespace-nowrap">
        <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mr-2">
          Trending Topics:
        </span>
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/category/${tag.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-xs font-semibold text-gray-600 px-3 py-1 border border-gray-200 rounded-full hover:border-[#E31E24] hover:text-[#E31E24] transition-all duration-300"
          >
            {tag}
          </Link>
        ))}
      </div>
      <Link 
        href="/news" 
        className="hidden md:flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-[#E31E24] hover:text-[#C41A20] transition-colors"
      >
        Live Briefing 
        <span className="w-2 h-2 rounded-full bg-[#E31E24] animate-pulse inline-block ml-1" />
      </Link>
    </div>
  );
}