import { createContext, useContext } from 'react';
import useApi from 'hooks/use-api';
import { Spinner } from '@chakra-ui/react';

const apiUserContext = createContext();

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
