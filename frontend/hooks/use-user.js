import { useApiUser } from '@/contexts/api-user-context';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useWithTokenFetcher } from './use-token-fetcher';

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

  return useSWR('users', withTokenFetcher);
}

export function useWithAdmin(replaceUrl) {
  const router = useRouter();
  const { user } = useApiUser();
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.is_admin;

  useEffect(() => {
    if (!isAdmin) {
      router.replace(replaceUrl);
    } else {
      setIsLoading(false);
    }
  }, [isAdmin, replaceUrl, router]);

  return { isLoading };
}
