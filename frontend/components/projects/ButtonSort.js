import { IconButton, Icon } from '@chakra-ui/core';
import { FaSort } from 'react-icons/fa';

export const ButtonSort = (props) => {
  return (
    <IconButton
      {...props}
      variant="ghost"
      size="sm"
      aria-label="Sort by name"
      icon={<Icon as={FaSort} color="gray.600" />}
    />
  );
};
