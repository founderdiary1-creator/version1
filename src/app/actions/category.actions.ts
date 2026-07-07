'use server'

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export async function fetchActiveCategories(): Promise<Category[]> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  // Fetch categories, ordering by name (or you could add a 'priority' column to your DB)
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}