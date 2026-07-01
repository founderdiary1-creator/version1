import { createClient } from './client';
import type { Industry } from '@/types';

export async function getIndustries() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('industries')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as Industry[];
}
