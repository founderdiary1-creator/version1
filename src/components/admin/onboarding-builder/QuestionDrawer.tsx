'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Info } from 'lucide-react';
import { FormQuestion, QuestionType, QuestionVisibility } from '@/types/onboarding';
import { useCreateQuestionMutation, useUpdateQuestionMutation } from '@/hooks/useOnboardingBuilder';

interface QuestionDrawerProps {
  sectionId: string;
  question: FormQuestion | null;
  onClose: () => void;
}

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'short_text', label: 'Short Text' },
  { value: 'long_text', label: 'Long Text' },
  { value: 'dropdown_single', label: 'Single Select Dropdown' },
  { value: 'dropdown_multi', label: 'Multi Select Dropdown' },
  { value: 'range_slider', label: 'Range Slider' },
  { value: 'file_upload', label: 'File Upload (Cloudinary)' },
  { value: 'audio_note', label: 'Audio Note (Cloudinary)' },
  { value: 'boolean', label: 'Yes/No (Boolean)' }
];

const ARCHETYPES = ['ALL', 'BOOTSTRAPPED', 'EARLY_VENTURE', 'GROWTH_SERIES_A'];
const VISIBILITY = ['MANDATORY', 'RECOMMENDED_MEMO', 'OPTIONAL_DEEP_DIVE'];

export default function QuestionDrawer({ sectionId, question, onClose }: QuestionDrawerProps) {
  const isEditing = !!question;
  const createMutation = useCreateQuestionMutation();
  const updateMutation = useUpdateQuestionMutation();

  const [formData, setFormData] = useState<Partial<FormQuestion>>({
    label: '',
    helper_text: '',
    placeholder: '',
    type: 'short_text',
    options: [],
    target_archetypes: ['ALL'],
    visibility_tier: 'MANDATORY',
    is_verification_artifact: false,
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (question) {
      setFormData(question);
    }
  }, [question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && question) {
        await updateMutation.mutateAsync({ ...formData, id: question.id } as any);
      } else {
        await createMutation.mutateAsync({
          ...formData,
          section_id: sectionId,
          order_index: 999, // Backend or reorder logic should handle exact index
        } as any);
      }
      onClose();
    } catch (err) {
      alert('Failed to save question');
    } finally {
      setLoading(false);
    }
  };

  const handleArchetypeToggle = (arch: string) => {
    const current = formData.target_archetypes || [];
    if (arch === 'ALL') {
      setFormData({ ...formData, target_archetypes: ['ALL'] });
    } else {
      let next = current.includes('ALL') ? [] : [...current];
      if (next.includes(arch)) {
        next = next.filter(a => a !== arch);
      } else {
        next.push(arch);
      }
      if (next.length === 0) next = ['ALL'];
      setFormData({ ...formData, target_archetypes: next });
    }
  };

  const hasOptions = ['dropdown_single', 'dropdown_multi', 'range_slider'].includes(formData.type || '');
  const hasCloudinary = ['file_upload', 'audio_note'].includes(formData.type || '');

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Question' : 'New Question'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Question Label *</label>
              <input 
                required
                type="text" 
                value={formData.label || ''}
                onChange={e => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#E31E24] focus:outline-none"
                placeholder="e.g. What is your current MRR?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Helper Text (Optional)</label>
              <textarea 
                value={formData.helper_text || ''}
                onChange={e => setFormData({ ...formData, helper_text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#E31E24] focus:outline-none text-sm"
                placeholder="Provide additional context to the founder..."
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Placeholder (Optional)</label>
              <input 
                type="text" 
                value={formData.placeholder || ''}
                onChange={e => setFormData({ ...formData, placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#E31E24] focus:outline-none text-sm"
                placeholder="e.g. $10,000"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Input Type *</label>
            <div className="grid grid-cols-2 gap-2">
              {QUESTION_TYPES.map(qt => (
                <button
                  key={qt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: qt.value })}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors ${
                    formData.type === qt.value
                      ? 'border-[#E31E24] bg-red-50 text-[#E31E24]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {qt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Options Builder */}
          {hasOptions && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Options Builder</label>
              <div className="space-y-2 mb-3">
                {(formData.options || []).map((opt: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={e => {
                        const newOpts = [...(formData.options || [])];
                        newOpts[idx] = e.target.value;
                        setFormData({ ...formData, options: newOpts });
                      }}
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg"
                    />
                    <button type="button" onClick={() => {
                        const newOpts = [...(formData.options || [])];
                        newOpts.splice(idx, 1);
                        setFormData({ ...formData, options: newOpts });
                      }} 
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, options: [...(formData.options || []), ''] })}
                className="text-sm text-[#E31E24] font-medium flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> Add Option
              </button>
            </div>
          )}

          {/* Cloudinary Integration Options */}
          {hasCloudinary && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">Cloudinary Upload Configured</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    Files will be securely uploaded to your Cloudinary vault. Ensure upload presets are active in settings.
                  </p>
                </div>
              </div>
              
              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={formData.is_verification_artifact}
                  onChange={e => setFormData({ ...formData, is_verification_artifact: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#E31E24] focus:ring-[#E31E24]"
                />
                <span className="text-sm text-gray-700 font-medium">Require as Verification Artifact (Proof)</span>
              </label>
            </div>
          )}

          <hr className="border-gray-100" />

          {/* Logic & Targeting */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">System Identity Mapping (Optional)</label>
              <select
                value={formData.system_key || ''}
                onChange={e => setFormData({ ...formData, system_key: e.target.value || null })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#E31E24] focus:outline-none bg-white"
              >
                <option value="">None (Generic Question)</option>
                <option value="founder_name">Founder Name</option>
                <option value="company_name">Company Name</option>
                <option value="company_logo">Company Logo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Target Archetypes</label>
              <div className="flex flex-wrap gap-2">
                {ARCHETYPES.map(arch => {
                  const isActive = formData.target_archetypes?.includes(arch);
                  return (
                    <button
                      key={arch}
                      type="button"
                      onClick={() => handleArchetypeToggle(arch)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                        isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {arch.replace(/_/g, ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Visibility Tier</label>
              <select
                value={formData.visibility_tier}
                onChange={e => setFormData({ ...formData, visibility_tier: e.target.value as QuestionVisibility })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#E31E24] focus:outline-none bg-white"
              >
                {VISIBILITY.map(v => (
                  <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
          </div>

        </form>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[#E31E24] text-white font-semibold rounded-lg hover:bg-[#C41A20] transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Question'}
          </button>
        </div>
      </div>
    </>
  );
}
