import PropTypes from 'prop-types';
import { Flex } from '@chakra-ui/react';

export const Main = ({ children }) => {
  return (
    <Flex as="main" flex={1} direction="column" w="full" maxW="6xl" mx="auto" px={[2, 4]} py={4}>
      {children}
    </Flex>
  );
};

Main.propTypes = {
  children: PropTypes.node.isRequired
};
