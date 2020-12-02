import { useCallback } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { Projects } from '@/components/projects/Projects';
import { Layout } from '@/components/Layout';
import { getProjects } from 'utils/projects-client';
import { useOrderBy } from '../../hooks/use-order-by';
import { useInfiniteScroll } from '../../hooks/use-infinite-scroll';
import { useDebouncedSearchKey } from '../../hooks/use-search';
import { objToQueryString } from '@/utils/query-string';
import { Header as ProjectsHeader } from '@/components/projects/Header';
import { InputSearch } from '@/components/InputSearch';

const PAGE_SIZE = 10;

function ProjectsPage() {
  const { orderBy, handleOrderByButtonClick, getOrderByQueryValue } = useOrderBy([
    'name',
    'key',
    'manager_id'
  ]);

  const { inputValue, handleInputValueChange, searchKey } = useDebouncedSearchKey('');

  const getKey = useCallback(
    (pageIndex) => {
      const queryString = objToQueryString({
        page: pageIndex,
        limit: PAGE_SIZE,
        orderBy: getOrderByQueryValue(),
        search: searchKey,
        withGraph: '[manager, engineers]'
      });

      return `projects?${queryString}`;
    },
    [getOrderByQueryValue, searchKey]
  );

  const {
    error,
    results: projects,
    isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    isRefreshing,
    isEmpty,
    size,
    fetchMore
  } = useInfiniteScroll(getKey, getProjects, 'projects', PAGE_SIZE);

  return (
    <Layout title="Projects">
      <ProjectsHeader mt={2}>
        <Heading size="lg">Projects</Heading>
        <Box mt={[1, 0]} w="full" maxW="12rem">
          <InputSearch value={inputValue} onChange={handleInputValueChange} />
        </Box>
      </ProjectsHeader>

      {error ? (
        <Text textAlign="center" mt={4}>
          Something went wrong... Please try reload the page
        </Text>
      ) : (
        <Box mt={8} overflow="auto">
          <Projects
            projects={projects}
            isLoadingInitialData={isLoadingInitialData}
            isLoadingMore={isLoadingMore}
            isReachingEnd={isReachingEnd}
            isRefreshing={isRefreshing}
            isEmpty={isEmpty}
            size={size}
            fetchMore={fetchMore}
            orderBy={orderBy}
            handleOrderByButtonClick={handleOrderByButtonClick}
            inputValue={inputValue}
            handleInputValueChange={handleInputValueChange}
          />
        </Box>
      )}
    </Layout>
  );
}

export default ProjectsPage;
