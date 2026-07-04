import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  // 1. Fetch your saved landing page configuration from Supabase
  // (Assuming you have a 'settings' table where the JSON config is saved)
  const { data: settingsData, error: settingsError } = await supabase
    .from('settings')
    .select('homepage_config')
    .single();

  if (settingsError || !settingsData?.homepage_config) {
    return NextResponse.json({ error: 'Homepage configuration not found in database.' }, { status: 404 });
  }

  const sectionConfigs = settingsData.homepage_config;
  const seenIds: string[] = [];
  const homepageData: Record<string, any[]> = {};

  // 2. Strict whitelist of active sections to compute
  const sectionOrder = [
    'hero',
    'latest',
    'indepth',
    'newsgrid',
    'morenews',
    'morearticles'
  ];

  // 3. Extract all tags used across the entire layout config to build the "Automated Mix" pool
  const allConfiguredTags: string[] = [];
  sectionOrder.forEach((key) => {
    if (sectionConfigs[key]?.tags && Array.isArray(sectionConfigs[key].tags)) {
      allConfiguredTags.push(...sectionConfigs[key].tags);
    }
  });
  const uniqueConfiguredTags = Array.from(new Set(allConfiguredTags));

  // 4. Run the deduplication pipeline loops
  for (const sectionKey of sectionOrder) {
    const config = sectionConfigs[sectionKey];

    // If the admin completely removed or omitted a section config, return an empty array
    if (!config) {
      homepageData[sectionKey] = [];
      continue;
    }

    let query = supabase
      .from('stories')
      .select('id, title, slug, summary, featured_image, is_premium, published_at, categories(name)') // <-- Fixed!
      .eq('status', 'published');

    // 🛑 STRICT DEDUPLICATION: Exclude everything already pushed into higher components
    if (seenIds.length > 0) {
      query = query.not('id', 'in', `(${seenIds.join(',')})`);
    }

    // ⚙️ RESOLVE SELECTION LOGIC
    if (config.mode === 'manual' && config.selectedIds?.length > 0) {
      // Manual Curation Mode
      query = query.in('id', config.selectedIds);
    } 
    else if (config.mode === 'tag' && config.tags?.length > 0) {
      // Direct Tag Targeting Mode
      query = query.contains('tags', config.tags);
      query = query.order('published_at', { ascending: false });
    } 
    else if (config.mode === 'auto' || !config.mode) {
      // Automated Mode
      if (sectionKey === 'hero') {
        // Hero auto: Absolute latest published stories
        query = query.order('published_at', { ascending: false });
      } else {
        // Non-hero auto: Fetch a dynamic mix of stories containing tags configured elsewhere
        if (uniqueConfiguredTags.length > 0) {
          // Matches any of the global admin tags (Overlap match)
          query = query.or(`tags.cs.{${uniqueConfiguredTags.join(',')}}`);
        }
        query = query.order('published_at', { ascending: false });
      }
    }

    // Apply the custom limit set by the admin panel range sliders/counters
    query = query.limit(config.count || 4);

    const { data: articles, error } = await query;

    if (error) {
      console.error(`Database engine error processing section [${sectionKey}]:`, error);
      homepageData[sectionKey] = [];
    } else {
      homepageData[sectionKey] = articles || [];
      // Keep feed clean: Mark these cards as seen so lower sections skip them completely
      articles?.forEach((article) => seenIds.push(article.id));
    }
  }

  return NextResponse.json(homepageData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    
    // 1. Initialize Supabase Client
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

    // 2. Security Check: Enforce Admin Only
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 401 }, 
        { status: 401 }
      );
    }

    // 3. Update the layout configuration in row ID 1
    const { data, error } = await supabase
      .from('settings')
      .update({ homepage_config: body.homepage_config })
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      console.error('[API_ERROR] /api/settings/homepage POST:', error);
      return NextResponse.json(
        { success: false, error: error.message, code: 500 },
        { status: 500 }
      );
    }

    // 4. Return success to React Query
    return NextResponse.json({ success: true, data });
    
  } catch (error: any) {
    console.error('[API_ERROR] /api/settings/homepage POST (unexpected):', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', code: 500 },
      { status: 500 }
    );
  }
}