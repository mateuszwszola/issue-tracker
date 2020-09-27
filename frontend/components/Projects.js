import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Heading, Box, Flex, Button, Link, Text, Avatar, AvatarGroup, Icon } from '@chakra-ui/core';
import { InputSearch } from '@/components/projects/InputSearch';
import { Header as ProjectsHeader } from '@/components/projects/Header';
import { Table, THead, TBody, TFoot, Tr, Th, Td, Caption } from '@/components/Table';
import { FaSort } from 'react-icons/fa';

export const Projects = ({ data }) => {
  return (
    <>
      <ProjectsHeader>
        <Heading size="lg">Projects</Heading>
        <Button size="sm" colorScheme="blue">
          Create project
        </Button>
      </ProjectsHeader>

      <InputSearch />

      <Table mt={8} w="full" border="2px" borderColor="gray.200">
        <Caption mb={1}>
          <Text fontSize="sm" textAlign="left" textTransform="uppercase" letterSpacing="wide" fontWeight="medium">
            Number of projects ({data.length})
          </Text>
        </Caption>
        <THead borderBottom="2px" borderColor="gray.200" bg="gray.100">
          <Tr>
            {['Name', 'Key', 'Lead', 'People'].map((name) => (
              <Th key={name}>
                <Button
                  d="block"
                  w="full"
                  textAlign="left"
                  px={2}
                  py={1}
                  size="sm"
                  variant="ghost"
                  rightIcon={<Icon as={FaSort} aria-label={`Sort by ${name}`} color="gray.400" />}
                >
                  {name}
                </Button>
              </Th>
            ))}
          </Tr>
        </THead>
        <TBody borderBottom="2px" borderColor="gray.200" fontSize={['sm', 'md']}>
          {data &&
            data.map((project) => (
              <Tr key={project.id} _hover={{ background: 'gray.50' }}>
                <Td>
                  <NextLink href="#">
                    <Link>
                      <Box px={2} py={[2, 4]}>
                        {project.name}
                      </Box>
                    </Link>
                  </NextLink>
                </Td>
                <Td px={2} py={[2, 4]}>
                  <Text>{project.key}</Text>
                </Td>
                <Td>
                  <NextLink href="#">
                    <Link>
                      <Flex px={2} py={[2, 4]} align="center">
                        <Avatar bg="red.500" size="sm" />
                        <Text ml={2}>{project.lead}</Text>
                      </Flex>
                    </Link>
                  </NextLink>
                </Td>
                <Td px={2} py={[2, 4]}>
                  <AvatarGroup size="sm" max={2}>
                    {project.users.map((user) => (
                      <Avatar key={user.id} />
                    ))}
                  </AvatarGroup>
                </Td>
              </Tr>
            ))}
        </TBody>
        <TFoot borderTop="2px" borderColor="gray.200">
          <Tr fontSize="sm">
            <Td p={2} colSpan="2">
              <Flex align="center">
                <Button size="sm" variant="link" colorScheme="blue">
                  Show more projects
                </Button>
              </Flex>
            </Td>
            <Td p={2} colSpan="2">
              <Text textAlign="right" color="gray.500" fontWeight="medium">
                {data.length} of {data.length}
              </Text>
            </Td>
          </Tr>
        </TFoot>
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
        },
        {
          id: 2,
          name: 'User name 2',
          picture: 'picture'
        },
        {
          id: 3,
          name: 'User name 3',
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

Projects.propTypes = {
  data: PropTypes.array.isRequired
};
