import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function useAccessToken() {
  const { getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        if (token) {
          setAccessToken(token);
        }
      } catch (error) {
        setError(error);
      }
    })();
  }, [getAccessTokenSilently]);

  return {
    accessToken,
    error
  };
}

export { useAccessToken };
