import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useApi from 'utils/use-api';
import { API_URL } from 'utils/api-client';

const ApiUserContext = createContext();

function ApiUserProvider(props) {
  const { data } = useApi(`${API_URL}/auth/login`, true, {
    method: 'POST'
  });

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

ApiUserProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export { ApiUserProvider, useApiUser };
