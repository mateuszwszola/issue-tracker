import PropTypes from 'prop-types';
import { Avatar, AvatarGroup, Box, Button, Flex, Text, useColorMode } from '@chakra-ui/react';
import {
  Table,
  tableBorderColor,
  tableHoverColor,
  tableRowBgColor,
  TBody,
  Td,
  Th,
  THead,
  Tr
} from '@/components/Table';
import { ButtonSort } from '@/components/projects/ButtonSort';
import { LoadingRow } from '@/components/projects/LoadingRow';
import { TableLink } from '@/components/projects/TableLink';

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

  let loadingRows = [];

  for (let i = 0; i < 4; i++) {
    loadingRows.push(<LoadingRow key={i} />);
  }

  return (
    <>
      <Box w="full" overflow="auto">
        <Table w="full" border="2px" borderColor="transparent">
          <THead borderBottom="2px" borderColor={tableBorderColor[colorMode]}>
            <Tr>
              <Th px={1}>
                <ButtonSort
                  order={orderBy['name']}
                  onClick={handleOrderByButtonClick('name')}
                  name="Name"
                />
              </Th>
              <Th px={1}>
                <ButtonSort
                  order={orderBy['key']}
                  onClick={handleOrderByButtonClick('key')}
                  name="Key"
                />
              </Th>
              <Th px={1}>
                <ButtonSort
                  order={orderBy['manager_id']}
                  onClick={handleOrderByButtonClick('manager_id')}
                  name="Lead"
                />
              </Th>
              <Th px={1} textAlign="left">
                <Text as="span" fontSize="sm" fontWeight="semibold">
                  Engineers
                </Text>
              </Th>
            </Tr>
          </THead>
          <TBody
            fontSize={['sm', 'md']}
            borderBottom="2px"
            borderColor={tableBorderColor[colorMode]}
          >
            {isLoadingInitialData ? (
              <>{loadingRows}</>
            ) : isEmpty ? (
              <Tr>
                <Td colSpan={4}>
                  <Text my={4} textAlign="center">
                    No projects found
                  </Text>
                </Td>
              </Tr>
            ) : (
              <>
                {projects.map((project, idx) => (
                  <Tr
                    key={project.id}
                    _hover={{ background: tableHoverColor[colorMode] }}
                    bgColor={idx % 2 === 0 ? 'transparent' : tableRowBgColor[colorMode]}
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
                          <TableLink href={`/user/${encodeURIComponent(project.manager?.id)}`}>
                            {project.manager?.picture && (
                              <Avatar
                                name={project.manager?.name}
                                src={project.manager?.picture}
                                bg="red.500"
                                size="sm"
                                mr={2}
                              />
                            )}
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
        </Table>
      </Box>

      <Flex
        mt={4}
        direction={['column-reverse', 'row']}
        align={['center', 'flex-start']}
        justify="space-between"
      >
        <Button
          mt={[3, 0]}
          disabled={isLoadingMore || isReachingEnd}
          onClick={fetchMore}
          size="sm"
          variant="outline"
          colorScheme="blue"
        >
          Show more projects
        </Button>

        <Text fontSize="sm" textAlign="right" color="gray.500" fontWeight="medium">
          Showing {size} page(s) of {isLoadingMore ? '...' : projects.length} projects
        </Text>
      </Flex>
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
