import { createContext, useContext } from 'react';
import useApi from 'utils/use-api';
import { Spinner } from '@chakra-ui/core';

const ApiUserContext = createContext();

const options = {
  method: 'POST'
};

function ApiUserProvider(props) {
  const { data, loading } = useApi(`auth/login`, true, options);

  if (loading) {
    return <Spinner />;
  }

  const value = {
    user: data?.user || null
  };

  return <ApiUserContext.Provider value={value} {...props} />;
}

function useApiUser() {
  const context = useContext(ApiUserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}

export { ApiUserProvider, useApiUser };
