import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize a lightweight Supabase client for public data fetching.
// Note: sitemap.ts runs as a special Route Handler, not a Server Component,
// so we cannot use cookies()-based createClient from lib/supabase/server.ts.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.founderdiary.in';

/**
 * Scalability scaffolding: generateSitemaps enables automatic sitemap indexing.
 * Currently a single shard (id: 0). When article count exceeds 50K, add
 * additional shards and paginate the Supabase query accordingly.
 * Generated sitemap will be available at /sitemap/0.xml
 */
export async function generateSitemaps() {
  return [{ id: 0 }];
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;

  // Fetch all published articles (minimal columns for performance)
  const { data: articles } = await supabase
    .from('stories')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  // Fetch all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')
    .order('name', { ascending: true });

  // Static routes with appropriate crawl priorities
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/datalabs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/plus`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/brand-lab`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Dynamic category routes
  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map(
    (cat) => ({
      url: `${BASE_URL}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    })
  );

  // Dynamic article routes
  const articleRoutes: MetadataRoute.Sitemap = (articles || []).map(
    (article) => ({
      url: `${BASE_URL}/article/${article.slug}`,
      lastModified: new Date(article.updated_at || article.published_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  );

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}