import client from '@/utils/api-client';
import { useAuth0 } from '@auth0/auth0-react';
import { useCallback } from 'react';

export function useWithTokenFetcher() {
  const { getAccessTokenSilently } = useAuth0();

  const withTokenFetcher = useCallback(
    async (url, { ...clientProps }) => {
      const token = await getAccessTokenSilently();

      return client(url, { token, ...clientProps });
    },
    [getAccessTokenSilently]
  );

  return withTokenFetcher;
}
