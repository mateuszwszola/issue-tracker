import Router from 'next/router';
import { ChakraProvider } from '@chakra-ui/core';
import { Auth0Provider } from '@auth0/auth0-react';
import theme from '../styles/theme';
import { UserProvider } from 'contexts/user-context';

const onRedirectCallback = (appState) => {
  Router.replace(appState?.returnTo || '/');
};

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      audience={process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}
      redirectUri={typeof window !== 'undefined' && window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <UserProvider>
        <ChakraProvider resetCSS theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </UserProvider>
    </Auth0Provider>
  );
}

export default MyApp;
