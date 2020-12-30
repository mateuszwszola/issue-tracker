import client from '@/utils/api-client';
import useSWR from 'swr';

export function useProfiles() {
  const { data, error, ...swrData } = useSWR('profiles', client);

  return {
    isLoading: !data && !error,
    profiles: data?.profiles,
    error,
    ...swrData
  };
}
