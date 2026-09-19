export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'dropdown_single'
  | 'dropdown_multi'
  | 'range_slider'
  | 'file_upload'
  | 'audio_note'
  | 'boolean';

export type QuestionVisibility =
  | 'MANDATORY'
  | 'RECOMMENDED_MEMO'
  | 'OPTIONAL_DEEP_DIVE';

export interface FormSection {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormQuestion {
  id: string;
  section_id: string;
  label: string;
  helper_text: string | null;
  placeholder: string | null;
  type: QuestionType;
  options: any | null; // e.g., array of strings for dropdowns
  target_archetypes: string[] | null;
  visibility_tier: QuestionVisibility;
  order_index: number;
  is_active: boolean;
  is_verification_artifact: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormSectionWithQuestions extends FormSection {
  questions: FormQuestion[];
}

export type FormSectionInsert = Omit<FormSection, 'id' | 'created_at' | 'updated_at'>;
export type FormSectionUpdate = Partial<FormSectionInsert> & { id: string };

export type FormQuestionInsert = Omit<FormQuestion, 'id' | 'created_at' | 'updated_at'>;
export type FormQuestionUpdate = Partial<FormQuestionInsert> & { id: string };
