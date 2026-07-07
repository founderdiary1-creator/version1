'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchActiveCategories } from '@/app/actions/category.actions';

export function useCategories() {
  return useQuery({
    queryKey: ['global-categories'],
    queryFn: fetchActiveCategories,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour since categories rarely change
    refetchOnWindowFocus: false,
  });
}