import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Safe for server-side read of settings
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  // 1. Fetch your saved landing page configuration from Supabase
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

  // 3. Extract all configured categories (labeled 'tags' in UI) to build the Automated Pool
  const allConfiguredCategories: string[] = [];
  sectionOrder.forEach((key) => {
    if (sectionConfigs[key]?.tags && Array.isArray(sectionConfigs[key].tags)) {
      allConfiguredCategories.push(...sectionConfigs[key].tags);
    }
  });
  const uniqueConfiguredCategories = Array.from(new Set(allConfiguredCategories));

  // 4. Run the deduplication pipeline loops
  for (const sectionKey of sectionOrder) {
    const config = sectionConfigs[sectionKey];

    // If the admin completely removed or omitted a section config, return an empty array
    if (!config) {
      homepageData[sectionKey] = [];
      continue;
    }

    // FIXED: Added !inner to categories so we can filter by it
    let query = supabase
      .from('stories')
      .select('id, title, slug, summary, featured_image, is_premium, published_at, categories!inner(name)')
      .eq('status', 'published');

   // 🛑 STRICT DEDUPLICATION: Manually wrap the array in parentheses to bypass the Supabase bug
    if (seenIds.length > 0) {
      query = query.not('id', 'in', `(${seenIds.join(',')})`);
    }

    // ⚙️ RESOLVE SELECTION LOGIC
    if (config.mode === 'manual' && config.selectedIds?.length > 0) {
      // Manual Curation Mode
      query = query.in('id', config.selectedIds);
    } 
    else if (config.mode === 'tag' && config.tags?.length > 0) {
      // FIXED: Direct Category Targeting Mode (Queries related categories.name, NOT a tags column)
      query = query.in('categories.name', config.tags);
      query = query.order('published_at', { ascending: false });
    } 
    else if (config.mode === 'auto' || !config.mode) {
      query = query.order('published_at', { ascending: false });
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