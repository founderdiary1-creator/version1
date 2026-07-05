
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const categorySlug = searchParams.get('category'); // e.g., 'ai-economy'
  const industryId = searchParams.get('industry');   // e.g., 'uuid-1234'
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // IMPORTANT: We use categories!inner() so Supabase knows to filter by the joined table
  let query = supabase
    .from('stories')
    .select('id, title, slug, summary, featured_image, published_at, author_name, categories!inner(id, name, slug), industries(id, name)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  // 1. Filter strictly by Category Slug
  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug);
  }

  // 2. Filter strictly by Industry ID
  if (industryId) {
    query = query.eq('industry_id', industryId);
  }

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: data || [],
    total: count || 0,
    page,
    totalPages: count ? Math.ceil(count / limit) : 0,
  });
}
