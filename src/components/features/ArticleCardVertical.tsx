import Image from 'next/image';
import Link from 'next/link';
import { CategoryTag } from '@/components/ui/CategoryTag';

interface ArticleCardVerticalProps {
  image: string;
  category: string;
  title: string;
  author: string;
  date: string;
  slug?: string;
  priority?: boolean;
}

export function ArticleCardVertical({ image, category, title, author, date, slug, priority = false }: ArticleCardVerticalProps) {
  
  // Premium Fallback State if Image is missing
  if (!image) {
    return (
      <article className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 p-5 shadow-sm">
        <div className="aspect-[16/10] bg-gray-50 flex items-center justify-center rounded-xl mb-4 border border-gray-100">
          <p className="text-gray-400 font-medium text-sm tracking-wide">Image unavailable</p>
        </div>
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug mb-3">
          {title}
        </h3>
      </article>
    );
  }

  const content = (
    <article className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_35px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer">
      
      {/* 1. Image Container with Hover Zoom & Layering */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        />
        
        {/* Subtle dark gradient layer on the bottom of the image for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Category Tag Positioned Elegantly */}
        <div className="absolute top-4 left-4 z-10 transition-transform duration-300 group-hover:translate-x-0.5">
          <CategoryTag category={category} variant="white" />
        </div>
        
        {/* FIXED: High-visibility Glassmorphic Watermark container ensures logo colors show beautifully */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-sm border border-gray-100/50 transition-all duration-500 group-hover:scale-105 z-10">
          <Image 
            src="/images/logo2.png" 
            alt="Founder Diary" 
            width={14} 
            height={14} 
            className="h-3.5 w-3.5 object-contain opacity-100" 
          />
        </div>
      </div>

      {/* 2. Content Body */}
      <div className="flex flex-col flex-grow p-5 lg:p-6">
        
        {/* Title with smooth color transition */}
        <h3 className="text-base lg:text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-5 transition-colors duration-300 group-hover:text-[#E31E24]">
          {title}
        </h3>
        
        {/* Bottom Metadata row matching Horizontal card standard */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500 transition-colors duration-300 group-hover:border-gray-100">
          
          {/* Author info with unique minimal initials avatar */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200/60 flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase shrink-0">
              {author.charAt(0)}
            </span>
            <span className="font-medium truncate max-w-[90px] md:max-w-[110px]">
              {author}
            </span>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-gray-300">•</span>
            <span className="font-medium">{date}</span>
          </div>

        </div>
      </div>
    </article>
  );

  if (slug) {
    return (
      <Link href={`/article/${slug}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-[#E31E24] focus-visible:ring-offset-4 rounded-2xl">
        {content}
      </Link>
    );
  }

  return <div className="block h-full">{content}</div>;
}