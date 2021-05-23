import PropTypes from 'prop-types';
import { HStack } from '@chakra-ui/react';

function FilterMenus({ children, ...props }) {
  return (
    <HStack spacing={3} align="center" mt={{ base: 2, md: 0 }} ml={{ md: 4 }} {...props}>
      {children}
    </HStack>
  );
}

FilterMenus.propTypes = {
  children: PropTypes.any
};

export default FilterMenus;
