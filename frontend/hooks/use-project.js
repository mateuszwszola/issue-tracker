import client from '@/utils/api-client';
import useSWR from 'swr';

export function useProjectTypes() {
  const { data, error, ...swrData } = useSWR('projects/type', client);

  return {
    projectTypes: data?.types,
    isLoading: !data && !error,
    error,
    ...swrData
  };
}
