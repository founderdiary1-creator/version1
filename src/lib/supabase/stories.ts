import { createClient } from './client';
import type { Article, ArticleInsert, ArticleUpdate } from '@/types';

const PAGE_SIZE = 10;

export async function getPublishedArticles(page = 0, limit = PAGE_SIZE, category?: string) {
  const supabase = createClient();
  let query = supabase
    .from('stories')
    .select('*, category:categories(*), industry:industries(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (category) {
    query = query.eq('category.slug', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Article[];
}

export async function getArticleBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stories')
    .select('*, category:categories(*), industry:industries(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data as Article;
}

export async function getFeaturedArticles() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stories')
    .select('*, category:categories(*), industry:industries(*)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data as Article[];
}

export async function getEditorsPicks() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stories')
    .select('*, category:categories(*), industry:industries(*)')
    .eq('status', 'published')
    .eq('is_editors_pick', true)
    .order('editors_pick_order', { ascending: true })
    .limit(5);

  if (error) throw error;
  return data as Article[];
}

export async function getPremiumArticles(page = 0, limit = PAGE_SIZE) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stories')
    .select('*, category:categories(*), industry:industries(*)')
    .eq('status', 'published')
    .eq('is_premium', true)
    .order('published_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) throw error;
  return data as Article[];
}

export async function getArticlesByCategory(categorySlug: string, page = 0, limit = PAGE_SIZE) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stories')
    .select('*, category:categories!inner(*)')
    .eq('status', 'published')
    .eq('categories.slug', categorySlug)
    .order('published_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) throw error;
  return data as Article[];
}

// Admin functions
export async function getAllArticles() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stories')
    .select('*, category:categories(*), industry:industries(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Article[];
}

export async function createArticle(article: ArticleInsert) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stories')
    .insert(article)
    .select()
    .single();

  if (error) throw error;
  return data as Article;
}

export async function updateArticle({ id, ...updates }: ArticleUpdate) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stories')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Article;
}

export async function deleteArticle(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
