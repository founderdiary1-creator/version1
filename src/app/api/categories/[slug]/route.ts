import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}