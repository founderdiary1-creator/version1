'use client';

import { useState } from 'react';
import { useFormSectionsQuery, useCreateSectionMutation } from '@/hooks/useOnboardingBuilder';
import { Plus, Eye, ListFilter } from 'lucide-react';
import SectionList from '@/components/admin/onboarding-builder/SectionList';
import LivePreview from '@/components/admin/onboarding-builder/LivePreview';
import QuestionDrawer from '@/components/admin/onboarding-builder/QuestionDrawer';
import PromptModal from '@/components/ui/PromptModal';
import { FormQuestion } from '@/types/onboarding';

export default function OnboardingBuilderPage() {
  const { data: sections = [], isLoading } = useFormSectionsQuery();
  const createSectionMutation = useCreateSectionMutation();
  
  const [filterArchetype, setFilterArchetype] = useState('ALL');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<{
    sectionId: string;
    question: FormQuestion | null; // null if creating new
  } | null>(null);

  const [isSectionPromptOpen, setIsSectionPromptOpen] = useState(false);

  const totalQuestions = sections.reduce((acc, s) => acc + (s.questions?.length || 0), 0);

  const handleCreateSectionSubmit = async (title: string) => {
    setIsSectionPromptOpen(false);
    await createSectionMutation.mutateAsync({
      title,
      description: '',
      order_index: sections.length,
      is_active: true
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Onboarding Builder</h1>
            <p className="text-gray-500 text-sm mt-1">
              Design the data intake flow for founder archetypes. ({totalQuestions} total questions)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="group flex items-center gap-2 bg-white text-gray-700 font-semibold px-5 py-2.5 rounded-xl border border-gray-200 hover:border-[#E31E24]/30 transition-all duration-300"
            >
              <Eye size={18} className="text-gray-400 group-hover:text-[#E31E24] transition-colors" /> 
              Preview Live Form
            </button>
            <button
              onClick={() => setIsSectionPromptOpen(true)}
              className="group flex items-center gap-2 bg-[#E31E24] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#C41A20] hover:shadow-[0_4px_20px_rgba(227,30,36,0.3)] transition-all duration-300"
            >
              <Plus size={18} className="transition-transform duration-300" /> 
              New Section
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-gray-500 mr-2">
            <ListFilter size={18} />
            <span className="text-sm font-medium">Filter by Archetype:</span>
          </div>
          <div className="flex gap-2 flex-1">
            {['ALL', 'BOOTSTRAPPED', 'EARLY_VENTURE', 'GROWTH_SERIES_A'].map((arch) => (
              <button
                key={arch}
                onClick={() => setFilterArchetype(arch)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterArchetype === arch
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {arch.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="mb-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <SectionList 
              sections={sections} 
              filterArchetype={filterArchetype}
              onEditQuestion={(sectionId, question) => setEditingQuestion({ sectionId, question })}
            />
          )}
        </div>

      </div>

      {/* Slide-over Drawer for Question Edit */}
      {editingQuestion && (
        <QuestionDrawer
          sectionId={editingQuestion.sectionId}
          question={editingQuestion.question}
          onClose={() => setEditingQuestion(null)}
        />
      )}

      {/* Live Preview Modal */}
      {isPreviewOpen && (
        <LivePreview 
          sections={sections} 
          onClose={() => setIsPreviewOpen(false)} 
        />
      )}

      <PromptModal
        isOpen={isSectionPromptOpen}
        title="Create New Section"
        description="Sections help organize your questions logically (e.g., 'Traction', 'Founder Info')."
        placeholder="Enter section title..."
        onConfirm={handleCreateSectionSubmit}
        onCancel={() => setIsSectionPromptOpen(false)}
      />
    </div>
  );
}
