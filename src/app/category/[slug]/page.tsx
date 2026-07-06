import type { Metadata } from 'next';
import CategoryClient from './CategoryClient';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  
  // Format the slug into a readable title (e.g., 'ai-economy' -> 'Ai Economy')
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: title,
    description: `Latest insights, breaking news, and in-depth analysis on ${title} from Founder Diary.`,
    openGraph: {
      title: `${title} | Founder Diary`,
      description: `Latest insights, breaking news, and in-depth analysis on ${title} from Founder Diary.`,
      url: `/category/${slug}`,
      type: 'website',
      images: [
        {
          url: `/images/og-default.jpeg`, // Ensure this placeholder exists, or dynamically link it
          width: 1200,
          height: 630,
          alt: `${title} insights on Founder Diary`,
        }
      ],
    },
  };
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return <CategoryClient params={params} />;
}