import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Minimal select for article cards — avoids fetching heavy content/content_blocks
const ARTICLE_CARD_SELECT = 'id, title, slug, featured_image, author_name, published_at, created_at, read_time, is_premium, is_featured, is_editors_pick, summary, category:categories(name, slug), industry:industries(name, slug)';

export async function GET() {
  try {
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

    // Run all queries in parallel for speed
    const [
      latestNewsResult,
      inDepthResult,
      newsGridResult,
    ] = await Promise.all([
      // 1. Latest News — 4 most recent published stories (skip first 3 used by hero)
      supabase
        .from('stories')
        .select(ARTICLE_CARD_SELECT)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(3, 6),

      // 2. In-Depth — 6 premium/in-depth stories
      supabase
        .from('stories')
        .select(ARTICLE_CARD_SELECT)
        .eq('status', 'published')
        .eq('is_premium', true)
        .order('published_at', { ascending: false })
        .limit(6),

      // 3. News Grid — 4 articles (next batch after latest news)
      supabase
        .from('stories')
        .select(ARTICLE_CARD_SELECT)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(7, 10),
    ]);

    // Check for errors
    const errors = [
      latestNewsResult.error,
      inDepthResult.error,
      newsGridResult.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      console.error('[API_ERROR] /api/stories/homepage-sections:', errors);
      throw errors[0];
    }

    return NextResponse.json({
      success: true,
      payload: {
        latestNews: latestNewsResult.data || [],
        inDepthStories: inDepthResult.data || [],
        newsGridStories: newsGridResult.data || [],
      },
    });
  } catch (error: any) {
    console.error('[API_ERROR] /api/stories/homepage-sections:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch homepage sections data', code: 500 },
      { status: 500 }
    );
  }
}
