import PropTypes from 'prop-types';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
  useColorMode
} from '@chakra-ui/react';
import { Table, TBody, Td, TFoot, Th, THead, Tr } from '@/components/Table';
import { InputSearch } from '@/components/InputSearch';
import { ButtonSort } from '@/components/projects/ButtonSort';
import { Header as ProjectsHeader } from '@/components/projects/Header';
import { TableLink } from '@/components/projects/TableLink';
import { useEffect, useState } from 'react';

export const Projects = ({ projects: data, isLoading }) => {
  const { colorMode } = useColorMode();
  const [projects, setProjects] = useState([]);
  const [nameSort, setNameSort] = useState('');

  useEffect(() => {
    setProjects(data);
  }, [data]);

  useEffect(() => {
    if (!nameSort) return;

    setProjects((prevProjects) => {
      return prevProjects.sort((a, b) => {
        return nameSort === 'asc' ? a.name - b.name : b.name - a.name;
      });
    });
  }, [nameSort]);

  const handleNameSortBtnClick = () => {
    setNameSort((prevSort) => (prevSort === 'asc' ? 'dsc' : 'asc'));
  };

  const borderColor = { light: 'gray.200', dark: 'gray.700' };
  const hoverColor = { light: 'gray.50', dark: 'gray.700' };

  return (
    <>
      <ProjectsHeader mt={2}>
        <Heading size="lg">Projects</Heading>
        <Box w="full" maxW="12rem">
          <InputSearch />
        </Box>
      </ProjectsHeader>

      <Box mt={8} overflowX="auto">
        {isLoading ? (
          <Stack>
            {Array(5)
              .fill(null)
              .map((_, idx) => (
                <Skeleton key={idx} height="40px" />
              ))}
          </Stack>
        ) : (
          <Table w="full" border="2px" borderColor="transparent">
            <THead borderBottom="2px" borderColor={borderColor[colorMode]}>
              <Tr>
                <Th>
                  <ButtonSort name="Name" onClick={handleNameSortBtnClick} />
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
              {Array.isArray(projects)
                ? projects.map((project) => (
                    <Tr key={project.id} _hover={{ background: hoverColor[colorMode] }}>
                      <Td>
                        <TableLink href={`/project/${encodeURIComponent(project.key)}`}>
                          {project?.name}
                        </TableLink>
                      </Td>
                      <Td p={2}>
                        <TableLink href={`/project/${encodeURIComponent(project.key)}`}>
                          {project?.key}
                        </TableLink>
                      </Td>
                      <Td>
                        <TableLink href={`/user/${encodeURIComponent(project.manager?.sub)}`}>
                          <Avatar bg="red.500" size="sm" mr={2} />
                          <Text as="span">{project.manager?.name}</Text>
                        </TableLink>
                      </Td>

                      <Td p={2}>
                        <AvatarGroup size="sm" max={2}>
                          {project.engineers?.map((user) => (
                            <Avatar key={user.id} />
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
                    Active projects: {projects.length}
                  </Text>
                </Td>
              </Tr>
            </TFoot>
          </Table>
        )}
      </Box>
    </>
  );
};

Projects.propTypes = {
  projects: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
};
