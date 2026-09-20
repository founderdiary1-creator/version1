import type { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ArticleClient from './ArticleClient';

async function getArticleBySlug(slug: string, isPreview: boolean = false) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  let query = supabase
    .from('stories')
    .select('title, summary, featured_image, author_name, published_at, category:categories(name, slug)')
    .eq('slug', slug);

  if (!isPreview) {
    query = query.eq('status', 'published');
  }

  const { data } = await query.single();

  return data;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const isPreview = resolvedSearchParams?.preview === 'true';
  const article = await getArticleBySlug(slug, isPreview);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The article you are looking for does not exist or has been removed.',
    };
  }

  const description = article.summary
    ? article.summary.slice(0, 160)
    : `Read ${article.title} — exclusive coverage and data-driven insights on Founder Diary.`;

  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
      url: `/article/${slug}`,
      type: 'article',
      publishedTime: article.published_at ?? undefined,
      authors: article.author_name ? [article.author_name] : ['Founder Diary'],
      section: (article.category as any)?.name ?? 'News',
      images: [
        {
          url: article.featured_image || '/images/og-default.jpeg',
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [article.featured_image || '/images/og-default.jpeg'],
    },
  };
}

export default async function ArticlePage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const isPreview = resolvedSearchParams?.preview === 'true';
  return <ArticleClient params={params} isPreview={isPreview} />;
}