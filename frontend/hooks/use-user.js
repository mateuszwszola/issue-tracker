import useSWR from 'swr';
import { useWithTokenFetcher } from './use-fetcher';

export function useUser() {
  const fetcher = useWithTokenFetcher();
  const { data, mutate, error } = useSWR('auth/login', (url) => fetcher(url, { method: 'POST' }), {
    shouldRetryOnError: false
  });

  return {
    loading: !data && !error,
    error,
    user: data?.user,
    mutate
  };
}

export function useUsers() {
  const withTokenFetcher = useWithTokenFetcher();

  const { data, error, ...swrData } = useSWR('users', withTokenFetcher);

  return {
    users: data?.users,
    isLoading: !data && !error,
    error,
    ...swrData
  };
}
