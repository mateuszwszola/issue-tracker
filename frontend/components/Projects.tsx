import NextLink from 'next/link';
import {
  Heading,
  Flex,
  Button,
  Link,
  Text,
  Avatar,
  AvatarGroup
} from '@chakra-ui/core';
import { InputSearch } from '@/components/projects/InputSearch';
import { ButtonSort } from '@/components/projects/ButtonSort';
import { Table, THead, TBody, Tr, Th, Td } from '@/components/Table';

type User = {
  id: number;
  name: string;
  picture: string;
};

type Project = {
  id: number;
  key: string;
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

      <Table mt={8}>
        <THead>
          <Tr>
            {['Name', 'Key', 'Lead', 'People'].map((name) => (
              <Th key={name}>
                <Flex align="center">
                  <Text mr={1} fontSize={['xs', 'sm']} fontWeight="medium">
                    {name}
                  </Text>
                  <ButtonSort />
                </Flex>
              </Th>
            ))}
          </Tr>
        </THead>
        <TBody>
          {data &&
            data.map((project) => (
              <Tr key={project.id} p={2} h="40px" fontSize={['sm', 'md']}>
                <Td>
                  <NextLink href="#">
                    <Link>{project.name}</Link>
                  </NextLink>
                </Td>
                <Td>{project.key}</Td>
                <Td>
                  <Flex align="center">
                    <Avatar bg="red.500" size="sm" />
                    <Text ml={2}>{project.lead}</Text>
                  </Flex>
                </Td>
                <Td>
                  <AvatarGroup size="sm" max={2}>
                    <Avatar />
                    <Avatar />
                    <Avatar />
                    <Avatar />
                  </AvatarGroup>
                </Td>
              </Tr>
            ))}
        </TBody>
      </Table>
    </>
  );
};

Projects.defaultProps = {
  data: [
    {
      id: 1,
      key: 'PRO-1',
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
      key: 'PRO-2',
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
