import { Box, Text } from '@chakra-ui/react';

import { projectName } from '../pages/index';

export const Footer = () => {
  return (
    <Box as="footer" w="full">
      <Box w="full" px={[2, 4]} py={2} maxW="6xl" mx="auto">
        <Text align="center" color="gray.500">
          &copy; {new Date().getFullYear()} - {projectName}
        </Text>
      </Box>
    </Box>
  );
};
