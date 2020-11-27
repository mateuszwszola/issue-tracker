import PropTypes from 'prop-types';
import { Button, Icon } from '@chakra-ui/react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

export const ButtonSort = ({ name, order, ...props }) => {
  const SortIcon = order === '' ? FaSort : order === 'asc' ? FaSortUp : FaSortDown;

  return (
    <Button
      {...props}
      d="block"
      w="full"
      textAlign="left"
      px={2}
      py={1}
      size="sm"
      variant="ghost"
      rightIcon={<Icon as={SortIcon} aria-label={`Order by ${name}`} color="gray.400" />}
    >
      {name}
    </Button>
  );
};

ButtonSort.propTypes = {
  name: PropTypes.string.isRequired,
  order: PropTypes.string.isRequired
};
