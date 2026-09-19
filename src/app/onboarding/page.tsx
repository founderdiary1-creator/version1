import { createClient } from '@/lib/supabase/server';
import { OnboardingWizard } from '@/components/features/onboarding/OnboardingWizard';
import { FormSectionWithQuestions } from '@/types/onboarding';

export const metadata = {
  title: 'Founder Playbook | Founder Diary',
  description: 'Submit your startup playbook to the Founder Diary intelligence network.',
};

export default async function OnboardingPage() {
  const supabase = await createClient();

  // Fetch active sections and active questions
  const { data: sections, error } = await supabase
    .from('form_sections')
    .select(`
      *,
      questions:form_questions(*)
    `)
    .eq('is_active', true)
    .order('order_index');

  if (error) {
    console.error('Error fetching form sections:', error);
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 text-center max-w-md">
          We couldn't load the onboarding form. Please try refreshing the page or check back later.
        </p>
      </div>
    );
  }

  // Filter out inactive questions and sort questions by order_index
  const formattedSections: FormSectionWithQuestions[] = (sections || []).map(section => {
    const activeQuestions = (section.questions || [])
      .filter((q: any) => q.is_active)
      .sort((a: any, b: any) => a.order_index - b.order_index);
    
    return {
      ...section,
      questions: activeQuestions,
    };
  });

  return <OnboardingWizard sections={formattedSections} />;
}
