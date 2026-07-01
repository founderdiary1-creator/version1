import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const category = searchParams.get('category');
    const industry = searchParams.get('industry');

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      }
    );

    let query = supabase
      .from('stories')
      .select('*, category:categories(*), industry:industries(*)', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1); // 1-indexed page for pagination UI

    if (category) {
      query = query.eq('category.slug', category);
    }
    if (industry) {
      query = query.eq('industry.slug', industry);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('[API_ERROR] /api/stories:', error);
      return NextResponse.json(
        { success: false, error: error.message, code: 500 },
        { status: 500 }
      );
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({ 
      success: true, 
      data,
      totalCount: count || 0,
      page,
      totalPages 
    });
  } catch (error: any) {
    console.error('[API_ERROR] /api/stories (unexpected):', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', code: 500 },
      { status: 500 }
    );
  }
}
