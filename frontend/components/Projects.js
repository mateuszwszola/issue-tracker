import PropTypes from 'prop-types';
import {
  Heading,
  Box,
  Flex,
  Button,
  Text,
  Avatar,
  AvatarGroup,
  useColorMode
} from '@chakra-ui/core';
import { Table, THead, TBody, TFoot, Tr, Th, Td, Caption } from '@/components/Table';
import { InputSearch } from '@/components/InputSearch';
import { ButtonSort } from '@/components/projects/ButtonSort';
import { Header as ProjectsHeader } from '@/components/projects/Header';
import { TableLink } from '@/components/projects/TableLink';

export const Projects = ({ data }) => {
  const { colorMode } = useColorMode();

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

      <Box mt={8} overflowX="auto">
        <Table w="full" border="2px" borderColor="transparent">
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
              <Th>
                <ButtonSort name="Name" />
              </Th>
              <Th>
                <ButtonSort name="Key" />
              </Th>
              <Th>
                <ButtonSort name="Lead" />
              </Th>
              <Th px={2} py={1} textAlign="left">
                <Text as="span" fontSize="sm" fontWeight="semibold">
                  Engineers
                </Text>
              </Th>
            </Tr>
          </THead>
          <TBody fontSize={['sm', 'md']}>
            {Array.isArray(data) && data?.length > 0
              ? data.map((project) => (
                  <Tr key={project?.id} _hover={{ background: hoverColor[colorMode] }}>
                    <Td>
                      <TableLink href={`/project/${encodeURIComponent(project?.key)}`}>
                        {project?.name}
                      </TableLink>
                    </Td>
                    <Td p={2}>
                      <TableLink href={`/project/${encodeURIComponent(project?.key)}`}>
                        {project?.key}
                      </TableLink>
                    </Td>
                    <Td>
                      <TableLink href={`/users/${encodeURIComponent(project?.manager)}`}>
                        <Avatar bg="red.500" size="sm" mr={2} />
                        <Text as="span">{project?.manager}</Text>
                      </TableLink>
                    </Td>

                    <Td p={2}>
                      <AvatarGroup size="sm" max={2}>
                        {project?.engineers?.map((user) => (
                          <Avatar key={user?.id} />
                        ))}
                      </AvatarGroup>
                    </Td>
                  </Tr>
                ))
              : ''}
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
      engineers: [
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
      engineers: [
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
