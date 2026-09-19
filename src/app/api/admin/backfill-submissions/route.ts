import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  // 1. Fetch all questions that have a system_key
  const { data: questions, error: qError } = await supabase
    .from('form_questions')
    .select('id, system_key')
    .not('system_key', 'is', null);

  if (qError || !questions) {
    return NextResponse.json({ success: false, error: 'Failed to fetch questions' }, { status: 500 });
  }

  // 2. Fetch all submissions
  const { data: submissions, error: sError } = await supabase
    .from('form_submissions')
    .select('id, payload');

  if (sError || !submissions) {
    return NextResponse.json({ success: false, error: 'Failed to fetch submissions' }, { status: 500 });
  }

  let updatedCount = 0;

  // 3. Iterate and backfill
  for (const sub of submissions) {
    if (!sub.payload) continue;

    const updates: any = {};
    let hasUpdates = false;

    for (const q of questions) {
      if (sub.payload[q.id] !== undefined) {
        updates[q.system_key] = sub.payload[q.id];
        hasUpdates = true;
      }
    }

    if (hasUpdates) {
      const { error: updateError } = await supabase
        .from('form_submissions')
        .update(updates)
        .eq('id', sub.id);

      if (!updateError) {
        updatedCount++;
      } else {
        console.error(`Failed to backfill submission ${sub.id}`, updateError);
      }
    }
  }

  return NextResponse.json({ success: true, message: `Successfully backfilled ${updatedCount} submissions.` });
}
