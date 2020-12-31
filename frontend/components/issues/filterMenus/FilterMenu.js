import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Flex,
  Text,
  SkeletonText
} from '@chakra-ui/react';
import { GoChevronDown } from 'react-icons/go';
import useSWR from 'swr';
import client from '@/utils/api-client';
import DisplayError from '@/components/DisplayError';

const resourceNames = {
  type: 'types',
  status: 'statuses',
  priority: 'priorities',
  assignee: 'profiles'
};

export const FilterMenu = ({ filterName, filterValue, handleFilterChange, fetchUrl }) => {
  const [startFetching, setStartFetching] = useState(false);

  const { data, error } = useSWR(startFetching ? fetchUrl : null, client);

  const resourceName = resourceNames[filterName];

  const options = data && data[resourceName];

  const selected = options?.find((option) => String(option.id) === String(filterValue));

  return (
    <Menu isLazy onOpen={() => setStartFetching(true)}>
      <MenuButton as={Button} d="block" w="full" size="sm" variant="ghost">
        <Flex justify="space-between" align="center">
          <Text textTransform="capitalize">{selected?.name || filterName}</Text>
          <Icon ml={1} as={GoChevronDown} />
        </Flex>
      </MenuButton>
      <MenuList>
        {error ? (
          <DisplayError textAlign="center" p={4} message="Something went wrong..." />
        ) : !data ? (
          <SkeletonText p={4} noOfLines={4} spacing="4" />
        ) : (
          <MenuOptionGroup type="radio" onChange={handleFilterChange}>
            <MenuItemOption>All</MenuItemOption>
            {options?.map((option) => (
              <MenuItemOption
                key={option.id}
                value={String(option.id)}
                isChecked={filterValue === String(option.id)}
              >
                {option.name}
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        )}
      </MenuList>
    </Menu>
  );
};

FilterMenu.propTypes = {
  filterName: PropTypes.string.isRequired,
  filterValue: PropTypes.string,
  handleFilterChange: PropTypes.func.isRequired,
  fetchUrl: PropTypes.string.isRequired
};
