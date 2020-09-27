import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {
  Heading,
  Box,
  Flex,
  Button,
  Link,
  Text,
  Avatar,
  AvatarGroup,
  useBreakpoint,
  useColorMode
} from '@chakra-ui/core';
import { Table, THead, TBody, TFoot, Tr, Th, Td, Caption } from '@/components/Table';
import { InputSearch } from '@/components/projects/InputSearch';
import { ButtonSort } from '@/components/projects/ButtonSort';
import { Header as ProjectsHeader } from '@/components/projects/Header';

export const Projects = ({ data }) => {
  const breakpoint = useBreakpoint();
  const { colorMode } = useColorMode();

  const showUsersColumn = breakpoint !== 'base';

  const bgColor = { light: 'gray.100', dark: 'gray.900' };
  const borderColor = { light: 'gray.200', dark: 'gray.700' };
  const hoverColor = { light: 'gray.50', dark: 'gray.700' };

  return (
    <>
      <ProjectsHeader>
        <Heading size="lg">Projects</Heading>
        <Button size="sm" colorScheme="blue">
          Create project
        </Button>
      </ProjectsHeader>

      <InputSearch />

      <Box mt={8}>
        <Table w="full" border="2px" borderColor={borderColor[colorMode]}>
          <Caption
            mb={1}
            fontSize="sm"
            textAlign="left"
            textTransform="uppercase"
            letterSpacing="wide"
            fontWeight="medium"
          >
            Number of projects ({data.length})
          </Caption>
          <THead borderBottom="2px" borderColor={borderColor[colorMode]} bg={bgColor[colorMode]}>
            <Tr>
              <Th w={showUsersColumn ? '25%' : '40%'}>
                <ButtonSort name="Name" />
              </Th>
              <Th w={showUsersColumn ? '25%' : '20%'}>
                <ButtonSort name="Key" />
              </Th>
              <Th w={showUsersColumn ? '25%' : '40%'} colSpan={!showUsersColumn ? '2' : '1'}>
                <ButtonSort name="Lead" />
              </Th>
              {showUsersColumn && (
                <Th w="25%">
                  <ButtonSort name="People" />
                </Th>
              )}
            </Tr>
          </THead>
          <TBody borderBottom="2px" borderColor={borderColor[colorMode]} fontSize={['sm', 'md']}>
            {data &&
              data.map((project) => (
                <Tr key={project.id} _hover={{ background: hoverColor[colorMode] }}>
                  <Td>
                    <NextLink href="#">
                      <Link d="block" px={2} py={[2, 4]}>
                        {project.name}
                      </Link>
                    </NextLink>
                  </Td>
                  <Td px={2} py={[2, 4]}>
                    <Text>{project.key}</Text>
                  </Td>
                  <Td colSpan={!showUsersColumn ? '2' : '1'}>
                    <NextLink href="#">
                      <Link d="flex" px={2} py={[2, 4]} alignItems="center">
                        <Avatar bg="red.500" size="sm" />
                        <Text as="span" ml={2}>
                          {project.lead}
                        </Text>
                      </Link>
                    </NextLink>
                  </Td>
                  {showUsersColumn && (
                    <Td px={2} py={[2, 4]}>
                      <AvatarGroup size="sm" max={2}>
                        {project.users.map((user) => (
                          <Avatar key={user.id} />
                        ))}
                      </AvatarGroup>
                    </Td>
                  )}
                </Tr>
              ))}
          </TBody>
          <TFoot borderTop="2px" borderColor={borderColor[colorMode]}>
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
      </Box>
    </>
  );
};

Projects.defaultProps = {
  data: [
    {
      id: 1,
      key: 'PRO-1',
      name: 'Create React App',
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
