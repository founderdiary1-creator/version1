import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import type { Article, ArticleInsert, ArticleUpdate } from '@/types';

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export function usePaginatedStories(page: number, limit: number, categorySlug?: string, industryId?: string) {
  return useQuery({
    // Cache invalidates and refetches automatically when any of these change
    queryKey: ['stories', page, limit, categorySlug, industryId],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (categorySlug) params.append('category', categorySlug);
      if (industryId) params.append('industry', industryId);

      const res = await fetch(`/api/stories?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch stories');
      return res.json();
    },
  });
}

export function useStoryQuery(slug: string) {
  return useQuery({
    queryKey: ['story', slug],
    queryFn: async (): Promise<Article> => {
      const response = await apiClient.get(`/stories/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function useFeaturedStoriesQuery() {
  return useQuery({
    queryKey: ['stories', 'featured'],
    queryFn: async (): Promise<Article[]> => {
      const response = await apiClient.get('/stories/featured');
      return response.data;
    },
  });
}

export function usePremiumStoriesQuery(page = 0, limit = 10) {
  return useQuery({
    queryKey: ['stories', 'premium', page, limit],
    queryFn: async (): Promise<Article[]> => {
      const response = await apiClient.get(`/stories/premium?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
}

export function useEditorsPicksQuery() {
  return useQuery({
    queryKey: ['stories', 'editors-picks'],
    queryFn: async (): Promise<Article[]> => {
      const response = await apiClient.get('/stories/editors-picks');
      return response.data;
    },
  });
}

// ADMIN HOOKS
export function useAdminStoriesQuery() {
  return useQuery({
    queryKey: ['admin', 'stories'],
    queryFn: async (): Promise<Article[]> => {
      const response = await apiClient.get('/admin/stories');
      return response.data;
    },
  });
}

export function useAdminStoryQuery(id: string) {
  return useQuery({
    queryKey: ['admin', 'story', id],
    queryFn: async (): Promise<Article> => {
      const response = await apiClient.get(`/admin/stories/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateStoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (story: ArticleInsert) => {
      const response = await apiClient.post('/admin/stories', story);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stories'] });
    },
  });
}

export function useUpdateStoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (story: ArticleUpdate) => {
      const { id, ...updates } = story;
      const response = await apiClient.put(`/admin/stories/${id}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stories'] });
      // optionally invalidate specific story query
    },
  });
}

export function useDeleteStoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/admin/stories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stories'] });
    },
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const res = await fetch(`/api/categories/${slug}`);
      if (!res.ok) throw new Error('Category not found');
      return res.json();
    },
    retry: false, // Don't keep retrying if it's a 404
  });
}
