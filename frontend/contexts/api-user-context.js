import { FullPageSpinner } from '@/components/Loading';
import { useUser } from '@/hooks/use-user';
import { createContext, useContext } from 'react';

const apiUserContext = createContext();

function ApiUserProvider(props) {
  const { loading, user } = useUser();

  if (loading) {
    return <FullPageSpinner />;
  }

  const value = {
    user
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
