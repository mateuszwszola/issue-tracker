import React from 'react';
import { Heading, Box, Flex, Stack } from '@chakra-ui/core';
import { InputSearch } from '@/components/InputSearch';
import { FilterMenu } from '@/components/issues/FilterMenu';

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

        <Stack
          direction="row"
          align="center"
          flexWrap="wrap"
          spacing={{ base: 0, md: 2 }}
          ml={{ md: 4 }}
          mt={{ base: 2, md: 0 }}
        >
          <Box flex="1">
            <FilterMenu label="Assignee" options={['User #1', 'User #2']} />
          </Box>
          <Box flex="1">
            <FilterMenu label="Priority" options={['P1', 'P2', 'P3', 'P4', 'P5']} />
          </Box>
          <Box flex="1">
            <FilterMenu label="Status" options={['To Do', 'In Progress', 'Done']} />
          </Box>
          <Box flex="1">
            <FilterMenu label="Type" options={['Task', 'Bug', 'Feature Request']} />
          </Box>
        </Stack>
      </Flex>
    </>
  );
};
