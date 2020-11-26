import PropTypes from 'prop-types';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Heading,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorMode
} from '@chakra-ui/react';
import { Table, TBody, Td, TFoot, Th, THead, Tr } from '@/components/Table';
import { InputSearch } from '@/components/InputSearch';
import { ButtonSort } from '@/components/projects/ButtonSort';
import { Header as ProjectsHeader } from '@/components/projects/Header';
import { TableLink } from '@/components/projects/TableLink';

export const Projects = ({ data }) => {
  const { colorMode } = useColorMode();

  const borderColor = { light: 'gray.200', dark: 'gray.700' };
  const hoverColor = { light: 'gray.100', dark: 'gray.700' };
  const rowBgColor = { light: 'gray.50', dark: 'gray.900' };

  return (
    <>
      <ProjectsHeader mt={2}>
        <Heading size="lg">Projects</Heading>
        <Box mt={[1, 0]} w="full" maxW="12rem">
          <InputSearch />
        </Box>
      </ProjectsHeader>

      <Box mt={8} overflowX="auto">
        <Table w="full" border="2px" borderColor="transparent">
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
            {!data ? (
              <>
                {Array(4)
                  .fill(null)
                  .map((_, idx) => (
                    <Tr key={idx}>
                      <Td py={1}>
                        <Skeleton width="100%" height="40px" />
                      </Td>
                      <Td p={2}>
                        <Skeleton width="100%" height="40px" />
                      </Td>
                      <Td p={2}>
                        <SkeletonCircle size="10" />
                      </Td>
                      <Td p={2}>
                        <AvatarGroup>
                          <SkeletonCircle size="10" />
                          <SkeletonCircle size="10" />
                          <SkeletonCircle size="10" />
                        </AvatarGroup>
                      </Td>
                    </Tr>
                  ))}
              </>
            ) : (
              <>
                {data.projects?.results?.map((project, idx) => (
                  <Tr
                    key={project.id}
                    _hover={{ background: hoverColor[colorMode] }}
                    bgColor={idx % 2 === 0 ? 'transparent' : rowBgColor[colorMode]}
                  >
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
                      {project.manager && (
                        <Flex align="center">
                          {project.manager?.picture && (
                            <Avatar
                              name={project.manager?.name}
                              src={project.manager?.picture}
                              bg="red.500"
                              size="sm"
                              mr={2}
                            />
                          )}
                          <TableLink href={`/user/${encodeURIComponent(project.manager?.sub)}`}>
                            <Text as="span">{project.manager?.name}</Text>
                          </TableLink>
                        </Flex>
                      )}
                    </Td>

                    <Td p={2}>
                      <AvatarGroup size="sm" max={2}>
                        {project.engineers?.map((user) => (
                          <Avatar name={user.name} picture={user.picture} key={user.id} />
                        ))}
                      </AvatarGroup>
                    </Td>
                  </Tr>
                ))}
              </>
            )}
          </TBody>
          <TFoot borderTop="2px" borderColor={borderColor[colorMode]}>
            <Tr>
              <Td p={2} colSpan="2">
                <Flex align="center">
                  {data?.projects?.length < data?.projects?.total && (
                    <Button size="sm" variant="link" colorScheme="blue">
                      Show more projects
                    </Button>
                  )}
                </Flex>
              </Td>
              <Td p={2} colSpan="2">
                <Text fontSize="sm" textAlign="right" color="gray.500" fontWeight="medium">
                  Projects: {data?.projects?.results?.length}
                </Text>
              </Td>
            </Tr>
          </TFoot>
        </Table>
      </Box>
    </>
  );
};

Projects.propTypes = {
  data: PropTypes.object
};
