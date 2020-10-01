import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Flex
} from '@chakra-ui/core';
import { GoChevronDown } from 'react-icons/go';

export const FilterMenu = ({ label, options }) => {
  const [numberOfFilters, setNumberOfFilters] = React.useState(0);

  const handleChange = (newValues) => {
    setNumberOfFilters(newValues.length);
  };

  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={Button} d="block" w="full" size="sm" variant="ghost">
        <Flex justify="space-between" align="center">
          {label} {numberOfFilters > 0 ? `(${numberOfFilters})` : ''}
          <Icon ml={1} as={GoChevronDown} />
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuOptionGroup type="checkbox" onChange={handleChange}>
          {options.map((option) => (
            <MenuItemOption key={option} value={option}>
              {option}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

FilterMenu.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired
};
