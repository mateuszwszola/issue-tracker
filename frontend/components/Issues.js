import PropTypes from 'prop-types';
import {
  Heading,
  Box,
  Flex,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Stack
} from '@chakra-ui/core';
import { InputSearch } from './InputSearch';
import { GoChevronDown } from 'react-icons/go';

const FilterMenu = ({ label, children }) => {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={Button} size="sm" variant="ghost" rightIcon={<Icon as={GoChevronDown} />}>
        {label}
      </MenuButton>
      <MenuList>{children}</MenuList>
    </Menu>
  );
};

FilterMenu.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export const Issues = () => {
  return (
    <>
      <Box>
        <Heading size="lg">Issues</Heading>
      </Box>

      <Flex mt={4} direction={['column', null, 'row']} align="center">
        <Box w="full" maxW={['100%', 'xs']}>
          <InputSearch />
        </Box>

        <Stack direction="row" align="center" space={2} ml={{ md: 4 }} mt={[2, null, 0]} flexWrap="wrap">
          <Box>
            <FilterMenu label="Assignee">
              <MenuOptionGroup defaultValue="unassigned">
                <MenuItemOption value="unassigned">Unassigned</MenuItemOption>
                <MenuItemOption value="user-1">User 1</MenuItemOption>
                <MenuItemOption value="user-2">User 2</MenuItemOption>
              </MenuOptionGroup>
            </FilterMenu>
          </Box>
          <Box>
            <FilterMenu label="Priority">
              <MenuOptionGroup defaultValue="unassigned">
                <MenuItemOption value="unassigned">Unassigned</MenuItemOption>
                <MenuItemOption value="P0">P0</MenuItemOption>
                <MenuItemOption value="P1">P1</MenuItemOption>
                <MenuItemOption value="P2">P2</MenuItemOption>
              </MenuOptionGroup>
            </FilterMenu>
          </Box>
          <Box>
            <FilterMenu label="State">
              <MenuItem>To Do</MenuItem>
              <MenuItem>In Progress</MenuItem>
              <MenuItem>Done</MenuItem>
            </FilterMenu>
          </Box>
          <Box>
            <FilterMenu label="Type">
              <MenuItem>Task</MenuItem>
              <MenuItem>Bug</MenuItem>
              <MenuItem>Feature Request</MenuItem>
            </FilterMenu>
          </Box>
        </Stack>
      </Flex>
    </>
  );
};
