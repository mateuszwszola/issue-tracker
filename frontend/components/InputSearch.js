import { InputGroup, Input, InputRightElement, Icon, useColorModeValue } from '@chakra-ui/core';
import { BsSearch } from 'react-icons/bs';

export const InputSearch = () => {
  const inputBgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <InputGroup size="sm">
      <Input placeholder="Search..." bg={inputBgColor} />
      <InputRightElement>
        <Icon as={BsSearch} />
      </InputRightElement>
    </InputGroup>
  );
};
