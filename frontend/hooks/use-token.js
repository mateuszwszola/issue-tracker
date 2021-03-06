import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function useAccessToken() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    setIsLoading(true);

    (async () => {
      try {
        const token = await getAccessTokenSilently();
        if (token) {
          setAccessToken(token);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [getAccessTokenSilently, isAuthenticated, isLoading]);

  return {
    accessToken,
    error,
    isLoading
  };
}

export { useAccessToken };
