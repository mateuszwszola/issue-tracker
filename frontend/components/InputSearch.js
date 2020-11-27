import { InputGroup, Input, InputRightElement, Icon, useColorModeValue } from '@chakra-ui/react';
import { BsSearch } from 'react-icons/bs';

export const InputSearch = ({ ...props }) => {
  const inputBgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <InputGroup size="sm">
      <Input placeholder="Search..." bg={inputBgColor} {...props} />
      <InputRightElement>
        <Icon as={BsSearch} />
      </InputRightElement>
    </InputGroup>
  );
};
