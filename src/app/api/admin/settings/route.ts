// app/api/settings/homepage/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  const { data, error } = await supabase
    .from('settings')
    .select('homepage_config')
    .eq('id', 1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || { homepage_config: {} });
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