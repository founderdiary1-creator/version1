import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ReviewStudio } from '@/components/features/admin/submissions/ReviewStudio';

export const metadata = {
  title: 'Submission Review | Admin | Founder Diary',
};

export default async function SubmissionReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  const [{ data: submission }, { data: sections }] = await Promise.all([
    supabase.from('form_submissions').select('*').eq('id', id).single(),
    supabase.from('form_sections').select('*, questions:form_questions(*)').order('order_index')
  ]);

  if (!submission) {
    notFound();
  }

  return (
    <ReviewStudio 
      submission={submission} 
      sections={sections || []} 
    />
  );
}
