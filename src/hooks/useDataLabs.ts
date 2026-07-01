import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import type { CompanyProfile, FundingRound } from '@/types';

export function useCompanyQuery(id?: string) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: async (): Promise<CompanyProfile | null> => {
      if (!id) return null;
      const response = await apiClient.get(`/datalabs/companies?id=${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useAllCompaniesQuery() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async (): Promise<CompanyProfile[]> => {
      const response = await apiClient.get('/datalabs/companies');
      return response.data;
    },
  });
}

export function useFundingSidebarQuery(limit = 10) {
  return useQuery({
    queryKey: ['datalabs_funding_rounds', limit],
    queryFn: async (): Promise<FundingRound[]> => {
      const response = await apiClient.get(`/datalabs/funding-rounds?limit=${limit}`);
      return response.data;
    },
  });
}

export function useCreateCompanyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (company: Omit<CompanyProfile, 'id' | 'created_at'>) => {
      const response = await apiClient.post('/datalabs/companies', company);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}
