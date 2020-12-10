import { useAccessToken } from '@/hooks/use-token';
import { fetcherWithToken } from '@/utils/api-client';
import { Spinner } from '@chakra-ui/react';
import { createContext, useContext } from 'react';
import useSWR from 'swr';

const apiUserContext = createContext();

const options = {
  method: 'POST'
};

function ApiUserProvider(props) {
  const { accessToken, isLoading: isLoadingToken } = useAccessToken();
  const { data, error } = useSWR(
    accessToken ? ['auth/login', accessToken] : null,
    (url, token) => fetcherWithToken(url, token, options),
    {
      revalidateOnFocus: false
    }
  );

  const isLoading = isLoadingToken || (accessToken && !error && !data);

  if (isLoading) {
    return <Spinner />;
  }

  const value = {
    user: data?.user || null
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
