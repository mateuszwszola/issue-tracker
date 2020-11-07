import { extendTheme } from '@chakra-ui/core';

const colors = {
  dark: '#3A2E39',
  light: '#FBFBF2',
  accent: '#2274A5'
};

const customTheme = extendTheme({ colors });

export default extendTheme(customTheme);
