import { Icon, Input, InputGroup, InputRightElement, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { BsSearch } from 'react-icons/bs';

export const InputSearch = ({ value, handleChange, ...props }) => {
  const inputBgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <InputGroup size="sm">
      <Input
        placeholder="Search..."
        bg={inputBgColor}
        value={value}
        onChange={handleChange}
        {...props}
      />
      <InputRightElement>
        <Icon as={BsSearch} />
      </InputRightElement>
    </InputGroup>
  );
};

InputSearch.propTypes = {
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
};
