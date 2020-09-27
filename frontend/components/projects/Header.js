import PropTypes from 'prop-types';
import { Flex } from '@chakra-ui/core';

export const Header = ({ children, ...props }) => {
  return (
    <Flex {...props} w="full" direction="row" justify="space-between" align="center" wrap="wrap">
      {children}
    </Flex>
  );
};

Header.propTypes = {
  children: PropTypes.node.isRequired
};
