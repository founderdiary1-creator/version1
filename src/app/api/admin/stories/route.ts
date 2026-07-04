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

    // Enforce Admin only by checking session (assuming RLS handles the rest or we do a quick check)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized', code: 401 }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('stories')
      .select('*, category:categories(*), industry:industries(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API_ERROR] /api/admin/stories GET:', error);
      return NextResponse.json(
        { success: false, error: error.message, code: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API_ERROR] /api/admin/stories GET (unexpected):', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', code: 500 },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized', code: 401 }, { status: 401 });
    }

    // 1. SECURITY FIX: Explicitly destructure only the allowed fields
    const {
      title, slug, summary, category_id, industry_id,
      is_premium, is_featured, is_editors_pick, read_time,
      company_id, summary_points, featured_image, status,
      published_at, content, content_blocks // <-- Our new Block Engine field
    } = body;

    // 2. Build the safe payload
    const safePayload = {
      title, slug, summary, category_id, industry_id,
      is_premium, is_featured, is_editors_pick, read_time,
      company_id, summary_points, featured_image, status,
      published_at, content, content_blocks,
      author_id: user.id // Override author_id strictly via server session
    };

    // 3. Remove undefined keys so Supabase relies on DB defaults
    Object.keys(safePayload).forEach(key => safePayload[key as keyof typeof safePayload] === undefined && delete safePayload[key as keyof typeof safePayload]);

    const { data, error } = await supabase
      .from('stories')
      .insert(safePayload)
      .select()
      .single();

    if (error) {
      console.error('[API_ERROR] /api/admin/stories POST:', error);
      return NextResponse.json(
        { success: false, error: error.message, code: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API_ERROR] /api/admin/stories POST (unexpected):', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', code: 500 },
      { status: 500 }
    );
  }
}

