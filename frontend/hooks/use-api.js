import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import client from '@/utils/api-client';

export const useApi = (url, options) => {
  const { getAccessTokenSilently } = useAuth0();
  const [state, setState] = useState({
    error: null,
    loading: true,
    data: null
  });

  useEffect(() => {
    (async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const data = await client(url, {
          token: accessToken,
          ...options
        });

        setState({
          ...state,
          data,
          error: null,
          loading: false
        });
      } catch (error) {
        setState({
          ...state,
          error,
          loading: false
        });
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
};
