import Router from 'next/router';
import { ChakraProvider } from '@chakra-ui/react';
import { Auth0Provider } from '@auth0/auth0-react';
import { SWRConfig } from 'swr';
import theme from '../styles/theme';
import { ApiUserProvider } from 'contexts/api-user-context';

const onRedirectCallback = (appState) => {
  Router.replace(appState?.returnTo || '/');
};

const swrGlobalConfig = {
  onErrorRetry: (error) => {
    // Never retry on 404.
    if (error.status === 404) return;
  }
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
      <ChakraProvider theme={theme}>
        <SWRConfig value={swrGlobalConfig}>
          <ApiUserProvider>
            <Component {...pageProps} />
          </ApiUserProvider>
        </SWRConfig>
      </ChakraProvider>
    </Auth0Provider>
  );
}

export default MyApp;
