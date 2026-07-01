import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

    // 1. Fetch Editor's Picks (up to 5)
    const { data: editorPicks, error: epError } = await supabase
      .from('stories')
      .select('*, category:categories(*), industry:industries(*)')
      .eq('status', 'published')
      .eq('is_editors_pick', true)
      .order('published_at', { ascending: false })
      .limit(5);

    if (epError) throw epError;

    // 2. Fetch Exclusive Story (1 featured or premium)
    const { data: exclusiveStoryList, error: exError } = await supabase
      .from('stories')
      .select('*, category:categories(*), industry:industries(*)')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(1);

    if (exError) throw exError;
    const exclusiveStory = exclusiveStoryList && exclusiveStoryList.length > 0 ? exclusiveStoryList[0] : null;

    // 3. Fetch Sub Features (2 normal published stories that are NOT the exclusive story or editor picks, to avoid duplicates)
    // For simplicity, we just fetch the latest 2 published
    let subQuery = supabase
      .from('stories')
      .select('*, category:categories(*), industry:industries(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (exclusiveStory) {
      subQuery = subQuery.neq('id', exclusiveStory.id);
    }
    
    const { data: subFeatures, error: sfError } = await subQuery.limit(2);
    if (sfError) throw sfError;

    // 4. Fetch Trending Tags (top 5 categories)
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('name')
      .limit(5);

    if (catError) throw catError;
    const trendingTags = categories ? categories.map((c: any) => c.name) : [];

    return NextResponse.json({
      success: true,
      payload: {
        trendingTags,
        exclusiveStory,
        editorPicks: editorPicks || [],
        subFeatures: subFeatures || [],
      }
    });

  } catch (error: any) {
    console.error('[API_ERROR] /api/stories/hero:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch hero data', code: 500 },
      { status: 500 }
    );
  }
}
