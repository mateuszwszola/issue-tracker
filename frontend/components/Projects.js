import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {
  Heading,
  Box,
  Flex,
  Button,
  Link as ChakraLink,
  Text,
  Avatar,
  AvatarGroup,
  useBreakpoint,
  useColorMode
} from '@chakra-ui/core';
import { Table, THead, TBody, TFoot, Tr, Th, Td, Caption } from '@/components/Table';
import { InputSearch } from '@/components/InputSearch';
import { ButtonSort } from '@/components/projects/ButtonSort';
import { Header as ProjectsHeader } from '@/components/projects/Header';

export const Projects = ({ data }) => {
  const breakpoint = useBreakpoint();
  const { colorMode } = useColorMode();

  const showExtraInfo = breakpoint !== 'base';

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

      <Box mt={4} w="full" maxW="12rem">
        <InputSearch />
      </Box>

      <Box mt={8}>
        <Table w="full">
          <Caption
            mb={1}
            fontSize="xs"
            textAlign="left"
            textTransform="uppercase"
            letterSpacing="wide"
            fontWeight="medium"
          >
            Active projects{' '}
            <Text as="span" d="inline-block" ml={2} fontWeight="semibold">
              {data.length}
            </Text>
          </Caption>
          <THead borderBottom="2px" borderColor={borderColor[colorMode]}>
            <Tr>
              <Th w={showExtraInfo ? '25%' : '40%'}>
                <ButtonSort name="Name" />
              </Th>
              <Th w={showExtraInfo ? '25%' : '20%'}>
                <ButtonSort name="Key" />
              </Th>
              <Th w={showExtraInfo ? '25%' : '40%'} colSpan={!showExtraInfo ? '2' : '1'}>
                <ButtonSort name="Lead" />
              </Th>
              {showExtraInfo && (
                <Th w="25%" px={2} py={1}>
                  <Text as="span" d="block" fontSize="sm" textAlign="left" fontWeight="semibold">
                    People
                  </Text>
                </Th>
              )}
            </Tr>
          </THead>
          <TBody fontSize={['sm', 'md']}>
            {data &&
              data.map((project) => (
                <Tr key={project.id} _hover={{ background: hoverColor[colorMode] }}>
                  <Td>
                    <NextLink href="#" passHref>
                      <ChakraLink d="block" p={2} color="blue.600">
                        {project.name}
                      </ChakraLink>
                    </NextLink>
                  </Td>
                  <Td p={2}>
                    <Text>{project.key}</Text>
                  </Td>
                  <Td colSpan={!showExtraInfo ? '2' : '1'}>
                    <NextLink href="#" passHref>
                      <ChakraLink d="flex" alignItems="center" p={2} color="blue.600">
                        {showExtraInfo && <Avatar bg="red.500" size="sm" mr={2} />}
                        <Text as="span">{project.lead}</Text>
                      </ChakraLink>
                    </NextLink>
                  </Td>
                  {showExtraInfo && (
                    <Td p={2}>
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
            <Tr>
              <Td p={2} colSpan="2">
                <Flex align="center">
                  <Button size="sm" variant="link" colorScheme="blue">
                    Show more projects
                  </Button>
                </Flex>
              </Td>
              <Td p={2} colSpan="2">
                <Text fontSize="sm" textAlign="right" color="gray.500" fontWeight="medium">
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
      lead: 'Johnjohny Doe',
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
