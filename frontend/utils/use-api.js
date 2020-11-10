import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import client from './api-client';

export const API_AUDIENCE = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

function useApi(url, isTokenRequired, options = {}) {
  const { getAccessTokenSilently, isLoading, isAuthenticated } = useAuth0();
  const [state, setState] = useState({
    error: null,
    loading: false,
    data: null
  });
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    (async () => {
      try {
        const { audience = API_AUDIENCE, ...clientOptions } = options;
        setState((s) => ({ ...s, loading: true, error: null, data: null }));
        let token;
        if (isTokenRequired) {
          token = await getAccessTokenSilently({ audience });
        }

        const data = await client(url, { token, ...clientOptions });

        setState((s) => ({
          ...s,
          data,
          error: null,
          loading: false
        }));
      } catch (error) {
        setState((s) => ({
          ...s,
          error,
          data: null,
          loading: false
        }));
      }
    })();
  }, [refreshIndex, isLoading, isAuthenticated]);

  return {
    ...state,
    refresh: () => setRefreshIndex((i) => i + 1)
  };
}

export default useApi;
