import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useApi from 'utils/use-api';
import { API_URL } from 'utils/api-client';

const UserContext = createContext();

function UserProvider(props) {
  const { data, loading, error } = useApi(`${API_URL}/auth/login`, true, {
    method: 'POST'
  });

  if (loading) {
    return <div>Loading API user...</div>;
  }

  if (error) {
    console.error(error);
  }

  const value = {
    user: data?.user || null
  };

  return <UserContext.Provider value={value} {...props} />;
}

function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}

UserProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export { UserProvider, useUser };
