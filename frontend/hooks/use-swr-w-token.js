import client from '@/utils/api-client';
import { useAccessToken } from './use-token';
import { useCallback } from 'react';
import useSWR from 'swr';

export function useSWRWithToken(url, clientProps) {
  const { accessToken } = useAccessToken();

  const fetcher = useCallback(
    (url, token) => {
      return client(url, { token, ...clientProps });
    },
    [clientProps]
  );

  return useSWR(accessToken ? [url, accessToken] : null, fetcher);
}
