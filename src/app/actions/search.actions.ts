'use server'

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Define strict types for our returns
export type SearchArticle = {
  slug: string;
  title: string;
  summary: string;
  featured_image: string;
  published_at: string;
  category: { name: string; slug: string };
};

export type TrendingData = {
  categories: { name: string; slug: string }[];
  trendingArticles: SearchArticle[];
};

export async function fetchSearchResults(query: string): Promise<SearchArticle[]> {
  if (!query) return [];

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  // Search across title OR summary, ignoring case
  const { data, error } = await supabase
    .from('stories')
    .select('slug, title, summary, featured_image, published_at, category:categories(name, slug)')
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error("Search Error:", error);
    return [];
  }
  
  // Normalize the category join for the frontend
  return (data || []).map(item => ({
    ...item,
    category: Array.isArray(item.category) ? item.category[0] : item.category
  })) as SearchArticle[];
}

export async function fetchTrendingData(): Promise<TrendingData> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  // Fetch all active categories
  const { data: categories } = await supabase
    .from('categories')
    .select('name, slug')
    .limit(8);

  // Fetch recent 'trending' articles (e.g., latest 3 for the empty state)
  const { data: trendingArticles } = await supabase
    .from('stories')
    .select('slug, title, summary, featured_image, published_at, category:categories(name, slug)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3);

  return {
    categories: categories || [],
    trendingArticles: (trendingArticles || []).map(item => ({
      ...item,
      category: Array.isArray(item.category) ? item.category[0] : item.category
    })) as SearchArticle[],
  };
}