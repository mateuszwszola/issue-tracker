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

function LoadingRow() {
  return (
    <Tr>
      <Td p={1}>
        <Skeleton width="100%" height="40px" />
      </Td>
      <Td p={1}>
        <Skeleton width="100%" height="40px" />
      </Td>
      <Td p={1}>
        <SkeletonCircle size="10" />
      </Td>
      <Td p={1}>
        <AvatarGroup>
          <SkeletonCircle size="10" as={Avatar} />
          <SkeletonCircle size="10" as={Avatar} />
          <SkeletonCircle size="10" as={Avatar} />
        </AvatarGroup>
      </Td>
    </Tr>
  );
}

export const Projects = ({
  projects,
  isLoadingInitialData,
  isLoadingMore,
  size,
  isEmpty,
  isReachingEnd,
  fetchMore,
  orderBy,
  handleOrderByButtonClick
}) => {
  const { colorMode } = useColorMode();

  const borderColor = { light: 'gray.200', dark: 'gray.700' };
  const hoverColor = { light: 'gray.100', dark: 'gray.700' };
  const rowBgColor = { light: 'gray.50', dark: 'gray.900' };

  let loadingRows = [];

  for (let i = 0; i < 4; i++) {
    loadingRows.push(<LoadingRow key={i} />);
  }

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
              <Th px={1}>
                <ButtonSort onClick={handleOrderByButtonClick('name')} name="Name" />
              </Th>
              <Th px={1}>
                <ButtonSort onClick={handleOrderByButtonClick('key')} name="Key" />
              </Th>
              <Th px={1}>
                <ButtonSort onClick={handleOrderByButtonClick('manager_id')} name="Lead" />
              </Th>
              <Th px={1} textAlign="left">
                <Text as="span" fontSize="sm" fontWeight="semibold">
                  Engineers
                </Text>
              </Th>
            </Tr>
          </THead>
          <TBody fontSize={['sm', 'md']}>
            {isLoadingInitialData ? (
              <>{loadingRows}</>
            ) : (
              <>
                {isEmpty && <Text textAlign="center">No projects found</Text>}
                {projects.map((project, idx) => (
                  <Tr
                    key={project.id}
                    _hover={{ background: hoverColor[colorMode] }}
                    bgColor={idx % 2 === 0 ? 'transparent' : rowBgColor[colorMode]}
                  >
                    <Td p={1}>
                      <TableLink href={`/project/${encodeURIComponent(project.key)}`}>
                        {project.name}
                      </TableLink>
                    </Td>
                    <Td p={1}>
                      <TableLink href={`/project/${encodeURIComponent(project.key)}`}>
                        {project.key}
                      </TableLink>
                    </Td>
                    <Td p={1}>
                      {project.manager && (
                        <Flex align="center">
                          <TableLink href={`/user/${encodeURIComponent(project.manager?.sub)}`}>
                            {/*{project.manager?.picture && (*/}
                            {/*  <Avatar*/}
                            {/*    name={project.manager?.name}*/}
                            {/*    src={project.manager?.picture}*/}
                            {/*    bg="red.500"*/}
                            {/*    size="sm"*/}
                            {/*    mr={2}*/}
                            {/*  />*/}
                            {/*)}*/}
                            <Text as="span">{project.manager?.name}</Text>
                          </TableLink>
                        </Flex>
                      )}
                    </Td>

                    <Td p={1}>
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
              <Td px={1} py={4} colSpan="2">
                <Flex align="center">
                  <Button
                    disabled={isLoadingMore || isReachingEnd}
                    onClick={fetchMore}
                    size="sm"
                    variant="link"
                    colorScheme="blue"
                  >
                    Show more projects
                  </Button>
                </Flex>
              </Td>
              <Td px={1} py={2} colSpan="2">
                <Text fontSize="sm" textAlign="right" color="gray.500" fontWeight="medium">
                  Showing {size} page(s) of {isLoadingMore ? '...' : projects.length} projects
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
  projects: PropTypes.array.isRequired,
  isLoadingInitialData: PropTypes.bool.isRequired,
  isLoadingMore: PropTypes.bool.isRequired,
  size: PropTypes.number.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  isReachingEnd: PropTypes.bool.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  fetchMore: PropTypes.func.isRequired,
  orderBy: PropTypes.object.isRequired,
  handleOrderByButtonClick: PropTypes.func.isRequired
};
