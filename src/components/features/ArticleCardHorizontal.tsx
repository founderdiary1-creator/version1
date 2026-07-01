import Image from 'next/image';
import Link from 'next/link';
import { CategoryTag } from '@/components/ui/CategoryTag';

interface ArticleCardHorizontalProps {
  image: string;
  category: string;
  title: string;
  author: string;
  date: string;
  slug?: string;
}

export function ArticleCardHorizontal({ image, category, title, author, date, slug }: ArticleCardHorizontalProps) {
  const content = (
    <article className="group relative flex flex-col sm:flex-row gap-5 md:gap-8 p-3 -mx-3 rounded-2xl transition-all duration-300 hover:bg-gray-50/80 cursor-pointer">
      
      {/* 1. Image Section: Cinematic 16/10 ratio, responsive widths, and smooth scale */}
      <div className="relative w-full sm:w-[240px] md:w-[280px] shrink-0 aspect-[16/10] overflow-hidden rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-500 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, 280px"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        />
        
        {/* Soft dark gradient overlay for depth that fades in on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Premium Glassmorphic Watermark */}
        <div className="absolute top-2 right-2 bg-transparent  rounded-full p-1.5 transition-transform duration-500 group-hover:scale-110 z-10">
          <Image 
            src="/images/logo2.png" 
            alt="Founder Diary" 
            width={14} 
            height={14} 
            className="h-6 w-6  opacity-100" 
          />
        </div>
      </div>

      {/* 2. Content Section: Elegant typography scaling and spacing */}
      <div className="flex flex-col flex-1 py-1 md:py-2">
        <div className="flex items-center gap-3 mb-2.5">
          <CategoryTag category={category} />
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span className="text-[13px] font-medium tracking-wide text-gray-500 uppercase">
            {date}
          </span>
        </div>

        <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-snug line-clamp-2 md:line-clamp-3 mb-4 transition-colors duration-300 group-hover:text-[#E31E24]">
          {title}
        </h3>

        {/* Bottom Metadata & Animated Action */}
        <div className="mt-auto flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-3.5 transition-colors duration-300 group-hover:border-gray-200">
          
          {/* Author with auto-generated Avatar circle */}
          <span className="font-medium flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[11px] font-bold text-gray-600 uppercase">
              {author.charAt(0)}
            </span>
            {author}
          </span>

          {/* Animated "Read" Link that slides in seamlessly */}
          <div className="flex items-center text-[#E31E24] font-semibold overflow-hidden">
            <span className="text-[13px] uppercase tracking-wider translate-x-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
              Read
            </span>
            <svg 
              className="w-4 h-4 ml-1.5 transform -translate-x-6 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );

  // Wrap in Link conditionally, preserving accessibility
  if (slug) {
    return (
      <Link href={`/article/${slug}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-[#E31E24] focus-visible:ring-offset-4 rounded-2xl">
        {content}
      </Link>
    );
  }

  return <div className="block">{content}</div>;
}