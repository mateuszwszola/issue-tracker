import PropTypes from 'prop-types';
import { Heading, Box, Flex, Button, Icon, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/core';
import { InputSearch } from './InputSearch';
import { GoChevronDown } from 'react-icons/go';

const FilterMenu = ({ label, children }) => {
  return (
    <Menu>
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
        <Box w="full" maxW={['100%', 'sm']}>
          <InputSearch />
        </Box>
        <Flex ml={{ md: 4 }} mt={[2, null, 0]} direction="row" spacing={[1, 2, 4]} align="center">
          <FilterMenu label="Assignee">
            <MenuItem>User 1</MenuItem>
            <MenuItem>User 2</MenuItem>
            <MenuItem>User 3</MenuItem>
          </FilterMenu>
          <FilterMenu label="Priority">
            <MenuItem>P0</MenuItem>
            <MenuItem>P1</MenuItem>
            <MenuItem>P2</MenuItem>
          </FilterMenu>
          <FilterMenu label="State">
            <MenuItem>To Do</MenuItem>
            <MenuItem>In Progress</MenuItem>
            <MenuItem>Done</MenuItem>
          </FilterMenu>
          <FilterMenu label="Label">
            <MenuItem>Task</MenuItem>
            <MenuItem>Bug</MenuItem>
            <MenuItem>Feature Request</MenuItem>
          </FilterMenu>
        </Flex>
      </Flex>
    </>
  );
};
