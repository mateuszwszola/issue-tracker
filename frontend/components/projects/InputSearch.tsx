import {
  Box,
  InputGroup,
  Input,
  InputRightElement,
  Icon,
  useColorModeValue
} from '@chakra-ui/core';
import { BsSearch } from 'react-icons/bs';

export const InputSearch: React.FC = () => {
  const inputBgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box mt={4} w="full" maxW="12rem">
      <InputGroup size="sm">
        <Input placeholder="Search..." bg={inputBgColor} />
        <InputRightElement>
          <Icon as={BsSearch} />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};
