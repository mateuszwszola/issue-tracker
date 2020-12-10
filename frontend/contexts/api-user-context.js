import { useAccessToken } from '@/hooks/use-token';
import client from '@/utils/api-client';
import { Spinner, Flex } from '@chakra-ui/react';
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
    (url, token) => client(url, { token, ...options }),
    {
      revalidateOnFocus: false
    }
  );

  const isLoading = isLoadingToken || (accessToken && !error && !data);

  if (isLoading) {
    return (
      <Flex w="100%" h="100vh" justify="center" align="center">
        <Spinner size="xl" />
      </Flex>
    );
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
