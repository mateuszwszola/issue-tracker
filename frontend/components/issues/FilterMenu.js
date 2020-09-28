import PropTypes from 'prop-types';
import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption
} from '@chakra-ui/core';
import { GoChevronDown } from 'react-icons/go';

export const FilterMenu = ({ label, options }) => {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={Button} size="sm" variant="ghost" rightIcon={<Icon as={GoChevronDown} />}>
        {label}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup type="checkbox">
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
