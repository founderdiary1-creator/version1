import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { 
  FormSectionWithQuestions, 
  FormSectionInsert, 
  FormSectionUpdate, 
  FormQuestionInsert, 
  FormQuestionUpdate 
} from '@/types/onboarding';

export function useFormSectionsQuery() {
  return useQuery({
    queryKey: ['admin', 'onboarding-sections'],
    queryFn: async (): Promise<FormSectionWithQuestions[]> => {
      const response = await fetch('/api/admin/onboarding/sections');
      if (!response.ok) throw new Error('Failed to fetch sections');
      return response.json();
    },
  });
}

export function useCreateSectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (section: FormSectionInsert) => {
      const response = await fetch('/api/admin/onboarding/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(section),
      });
      if (!response.ok) throw new Error('Failed to create section');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'onboarding-sections'] });
    },
  });
}

export function useUpdateSectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: FormSectionUpdate) => {
      const response = await fetch(`/api/admin/onboarding/sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update section');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'onboarding-sections'] });
    },
  });
}

export function useDeleteSectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/onboarding/sections/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete section');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'onboarding-sections'] });
    },
  });
}

export function useCreateQuestionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (question: FormQuestionInsert) => {
      const response = await fetch('/api/admin/onboarding/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question),
      });
      if (!response.ok) throw new Error('Failed to create question');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'onboarding-sections'] });
    },
  });
}

export function useUpdateQuestionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: FormQuestionUpdate) => {
      const response = await fetch(`/api/admin/onboarding/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update question');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'onboarding-sections'] });
    },
  });
}

export function useDeleteQuestionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/onboarding/questions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete question');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'onboarding-sections'] });
    },
  });
}

export function useReorderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ type, items }: { type: 'sections' | 'questions', items: { id: string, order_index: number }[] }) => {
      const response = await fetch('/api/admin/onboarding/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, items }),
      });
      if (!response.ok) throw new Error('Failed to reorder');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'onboarding-sections'] });
    },
  });
}
