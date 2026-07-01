import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import type { Category, Industry } from '@/types';

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const response = await apiClient.get('/categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour (rarely changes)
  });
}

export function useIndustriesQuery() {
  return useQuery({
    queryKey: ['industries'],
    queryFn: async (): Promise<Industry[]> => {
      const response = await apiClient.get('/industries');
      return response.data;
    },
    staleTime: 1000 * 60 * 60,
  });
}
