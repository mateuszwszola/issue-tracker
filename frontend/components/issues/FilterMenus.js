import PropTypes from 'prop-types';
import { Flex } from '@chakra-ui/react';

function FilterMenus({ children, ...props }) {
  return (
    <Flex wrap="wrap" align="center" mt={[2, null, 0]} ml={{ lg: 4 }} {...props}>
      {children}
    </Flex>
  );
}

FilterMenus.propTypes = {
  children: PropTypes.any
};

export default FilterMenus;
