import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import client from '../utils/api-client';

function useApi(url, options = {}) {
  const { getAccessTokenSilently } = useAuth0();
  const [state, setState] = useState({
    error: null,
    loading: true,
    data: null
  });

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        const data = await client(url, { token, ...options });

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
          loading: false
        }));
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}

export default useApi;
