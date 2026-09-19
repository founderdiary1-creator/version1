import { createClient } from '@/lib/supabase/server';
import { SubmissionsTable } from '@/components/features/admin/submissions/SubmissionsTable';
import { FormSubmission } from '@/types/onboarding';

export const metadata = {
  title: 'Submissions Inbox | Admin | Founder Diary',
};

export default async function SubmissionsPage() {
  const supabase = await createClient();
  
  const { data: submissions, error } = await supabase
    .from('form_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    // If the table doesn't exist yet, we just pass an empty array to prevent crashing
    if (error.code === '42P01') {
      console.warn('form_submissions table not found.');
    } else {
      console.error('Failed to fetch submissions:', error);
    }
  }

  // To calculate completion rate, we ideally need to know how many questions were active.
  // For the sake of the inbox view, we'll calculate a simple count of answered keys in payload.
  
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Playbook Submissions</h1>
          <p className="text-gray-500 mt-1">Review, triage, and draft articles from inbound founder submissions.</p>
        </div>
      </div>
      <SubmissionsTable initialData={(submissions as FormSubmission[]) || []} />
    </div>
  );
}
