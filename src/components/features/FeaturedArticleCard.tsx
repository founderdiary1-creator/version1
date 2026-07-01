import Image from 'next/image';
import Link from 'next/link';
import { CategoryTag } from '@/components/ui/CategoryTag';

interface FeaturedArticleCardProps {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  slug?: string;
}

export function FeaturedArticleCard({ image, category, title, excerpt, author, date, slug }: FeaturedArticleCardProps) {
  if (!image) {
    return (
      <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center rounded-xl border border-gray-200 mb-4">
        <p className="text-gray-400 font-medium text-sm">Image unavailable</p>
      </div>
    );
  }

  const content = (
    <article className="cursor-pointer group">
      <div className="relative overflow-hidden rounded-xl aspect-[16/10] mb-4">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 660px"
          priority
          className="object-cover group-hover:scale-[1.02] transition-transform duration-400"
        />
        <div className="absolute top-4 left-4">
          <CategoryTag category={category} variant="white" />
        </div>
        <div className="absolute top-4 right-4">
          <Image src="/images/logo2.png" alt="Founder Diary" width={20} height={20} className="h-5 w-auto object-contain opacity-90" />
        </div>
      </div>
      <h2 className="text-[22px] font-bold text-gray-900 leading-tight mb-2 group-hover:text-[#E31E24] transition-colors">
        {title}
      </h2>
      <p className="text-sm text-gray-500 line-clamp-3 mb-3 leading-relaxed">
        {excerpt}
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>{author}</span>
        <span>|</span>
        <span>{date}</span>
      </div>
    </article>
  );

  if (slug) {
    return <Link href={`/article/${slug}`}>{content}</Link>;
  }
  return content;
}
