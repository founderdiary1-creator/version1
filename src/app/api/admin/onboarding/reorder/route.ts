import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { type, items } = await req.json();
    // type = 'sections' | 'questions'
    // items = [{ id, order_index }]

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
    }

    const table = type === 'sections' ? 'form_sections' : 'form_questions';

    // Supabase JS doesn't have a bulk update by default unless you do upsert.
    // We can do an upsert but we need to fetch existing rows or just do multiple updates
    // for small arrays (e.g. < 50 items), doing multiple updates is okay.
    // However, upsert is faster if we provide all required fields, but we only have id and order_index.
    
    for (const item of items) {
      const { error } = await supabase
        .from(table)
        .update({ order_index: item.order_index })
        .eq('id', item.id);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
