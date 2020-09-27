import { Heading, Box, Flex, Stack, Button, Icon } from '@chakra-ui/core';
import { InputSearch } from './InputSearch';
import { GoChevronDown } from 'react-icons/go';

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
        <Stack ml={{ md: 4 }} mt={[2, null, 0]} direction="row" spacing={[1, 2, 4]} align="center">
          <Button size="xs" variant="ghost" rightIcon={<Icon as={GoChevronDown} />}>
            Assignee
          </Button>
          <Button size="xs" variant="ghost" rightIcon={<Icon as={GoChevronDown} />}>
            Priority
          </Button>
          <Button size="xs" variant="ghost" rightIcon={<Icon as={GoChevronDown} />}>
            State
          </Button>
          <Button size="xs" variant="ghost" rightIcon={<Icon as={GoChevronDown} />}>
            Label
          </Button>
        </Stack>
      </Flex>
    </>
  );
};
