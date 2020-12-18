import useSWR from 'swr';
import { useWithTokenFetcher } from './use-fetcher';

export function useUser() {
  const fetcher = useWithTokenFetcher();
  const { data, mutate, error } = useSWR('auth/login', (url) => fetcher(url, { method: 'POST' }), {
    shouldRetryOnError: false
  });

  const loading = !data && !error;

  return {
    loading,
    error,
    user: data?.user,
    mutate
  };
}
