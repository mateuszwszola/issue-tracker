import { Flex, Spinner } from '@chakra-ui/react';

export const FullPageSpinner = () => (
  <Flex w="100%" h="100vh" justify="center" align="center">
    <Spinner size="xl" />
  </Flex>
);
