import { FullPageSpinner } from '@/components/Loading';
import { useWithTokenFetcher } from '@/hooks/use-token-fetcher';
import { useAuth0 } from '@auth0/auth0-react';
import { useToast } from '@chakra-ui/react';
import { createContext, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

const apiUserContext = createContext();

function ApiUserProvider(props) {
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  const { isLoading, isAuthenticated } = useAuth0();

  const fetcher = useWithTokenFetcher();

  const { data: loginData, error: loginError } = useSWR(
    isAuthenticated ? 'auth/login' : null,
    (url) => fetcher(url, { method: 'POST' }),
    {
      shouldRetryOnError: false,
      onError: () => {
        toast({
          title: 'An error occurred.',
          description: loginError?.message || 'Unable to log in a user',
          status: 'error',
          duration: 9000,
          isClosable: true
        });
      }
    }
  );

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  if (loading || (isAuthenticated && !loginData && !loginError)) {
    return <FullPageSpinner />;
  }

  const value = {
    user: loginData?.user || null
  };

  return <apiUserContext.Provider value={value} {...props} />;
}

function useApiUser() {
  const context = useContext(apiUserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}

export { ApiUserProvider, useApiUser };
