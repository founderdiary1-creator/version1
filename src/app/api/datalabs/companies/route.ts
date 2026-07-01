import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

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

    if (id) {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`[API_ERROR] /api/datalabs/companies GET id=${id}:`, error);
        return NextResponse.json({ success: false, error: error.message, code: 500 }, { status: 500 });
      }
      return NextResponse.json({ success: true, data });
    }

    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');

    if (error) {
      console.error('[API_ERROR] /api/datalabs/companies GET:', error);
      return NextResponse.json({ success: false, error: error.message, code: 500 }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API_ERROR] /api/datalabs/companies GET (unexpected):', error);
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

    // Enforce Admin only by checking session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized', code: 401 }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('companies')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('[API_ERROR] /api/datalabs/companies POST:', error);
      return NextResponse.json({ success: false, error: error.message, code: 500 }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API_ERROR] /api/datalabs/companies POST (unexpected):', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', code: 500 },
      { status: 500 }
    );
  }
}
