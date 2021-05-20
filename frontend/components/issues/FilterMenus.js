import PropTypes from 'prop-types';
import { SimpleGrid } from '@chakra-ui/react';

function FilterMenus({ children, ...props }) {
  return (
    <SimpleGrid mt={{ base: 2, md: 0 }} ml={{ md: 4 }} columns={[2, 4]} spacing={4} {...props}>
      {children}
    </SimpleGrid>
  );
}

FilterMenus.propTypes = {
  children: PropTypes.any
};

export default FilterMenus;
