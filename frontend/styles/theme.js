import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    dark: '#3A2E39',
    light: '#FBFBF2',
    accent: '#2274A5'
  }
};

const theme = extendTheme({ colors });

export default theme;
