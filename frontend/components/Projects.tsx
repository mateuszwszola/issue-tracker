import NextLink from 'next/link';
import {
  Heading,
  Flex,
  Button,
  Box,
  VStack,
  StackDivider,
  Link,
  Text,
  Avatar,
  AvatarGroup
} from '@chakra-ui/core';
import { InputSearch } from '@/components/projects/InputSearch';
import { TableHeaderCol } from '@/components/projects/TableHeaderCol';

type User = {
  id: number;
  name: string;
  picture: string;
};

type Project = {
  id: number;
  name: string;
  lead: string;
  users: User[];
};

export const Projects: React.FC<{ data?: Project[] }> = ({
  data
}: {
  data?: Project[];
}) => {
  return (
    <>
      <Flex direction="row" justify="space-between" align="center" wrap="wrap">
        <Heading size="lg">Projects</Heading>
        <Button size="sm" colorScheme="blue">
          Create project
        </Button>
      </Flex>

      <InputSearch />

      <VStack mt={8} divider={<StackDivider />} align="stretch">
        <Flex px={2} align="center">
          {['Name', 'Lead', 'People'].map((heading) => (
            <TableHeaderCol key={heading} name={heading} />
          ))}
        </Flex>
        {data &&
          data.map((project) => (
            <Flex key={project.id} p={2} h="40px" align="center">
              <Box flex="1">
                <NextLink href="#">
                  <Link>{project.name}</Link>
                </NextLink>
              </Box>
              <Flex flex="1" align="center">
                <Avatar bg="red.500" size="sm" />
                <Text ml={2}>{project.lead}</Text>
              </Flex>
              <Box flex="1">
                <AvatarGroup size="sm" max={2}>
                  <Avatar />
                  <Avatar />
                  <Avatar />
                  <Avatar />
                </AvatarGroup>
              </Box>
            </Flex>
          ))}
      </VStack>
    </>
  );
};

Projects.defaultProps = {
  data: [
    {
      id: 1,
      name: 'Project #1',
      lead: 'John Doe',
      users: [
        {
          id: 1,
          name: 'User name',
          picture: 'picture'
        }
      ]
    },
    {
      id: 2,
      name: 'Project #2',
      lead: 'Janna Doe',
      users: [
        {
          id: 1,
          name: 'User name',
          picture: 'picture'
        }
      ]
    }
  ]
};
