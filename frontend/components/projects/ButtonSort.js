import PropTypes from 'prop-types';
import { Button, Icon } from '@chakra-ui/core';
import { FaSort } from 'react-icons/fa';

export const ButtonSort = ({ name }) => {
  return (
    <Button
      d="block"
      w="full"
      textAlign="left"
      px={2}
      py={1}
      size="sm"
      variant="ghost"
      rightIcon={<Icon as={FaSort} aria-label={`Sort by ${name}`} color="gray.400" />}
    >
      {name}
    </Button>
  );
};

ButtonSort.propTypes = {
  name: PropTypes.string.isRequired
};