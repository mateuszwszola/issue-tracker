import { createContext, useContext } from 'react';
import useApi from '@/hooks/use-api';
import { FullPageSpinner } from '@/components/Loading';

const apiUserContext = createContext();

const options = {
  method: 'POST'
};

function ApiUserProvider(props) {
  const { loading, data } = useApi('auth/login', options);

  if (loading) {
    return <FullPageSpinner />;
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
