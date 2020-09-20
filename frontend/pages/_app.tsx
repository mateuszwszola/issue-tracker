import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/core';
import theme from '../styles/theme';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
