import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import type { Article } from '@/types';

export interface HeroPayload {
  trendingTags: string[];
  exclusiveStory: Article | null;
  editorPicks: Article[];
  subFeatures: Article[];
}

export function useHeroStories() {
  return useQuery({
    queryKey: ['stories', 'hero'],
    queryFn: async (): Promise<HeroPayload> => {
      const response: any = await apiClient.get('/stories/hero');
      return response.payload; // Since the API returns { success: true, payload: { ... } }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
