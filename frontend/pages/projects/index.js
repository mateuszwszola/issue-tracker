import { useCallback } from 'react';
import { Text } from '@chakra-ui/react';
import { Projects } from '@/components/Projects';
import { Layout } from '@/components/Layout';
import { getProjects } from 'utils/projects-client';
import { useOrderBy } from '../../hooks/use-order-by';
import { useInfiniteScroll } from '../../hooks/use-infinite-scroll';

const PAGE_SIZE = 10;

function ProjectsPage() {
  const { orderBy, handleOrderByButtonClick, getOrderByQueryString } = useOrderBy([
    'name',
    'key',
    'manager_id'
  ]);

  const getKey = useCallback(
    (pageIndex) => {
      const orderByQueryString = getOrderByQueryString();

      return `projects?page=${pageIndex}&limit=${PAGE_SIZE}${
        orderByQueryString ? `&${orderByQueryString}` : ''
      }`;
    },
    [getOrderByQueryString]
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
      {error ? (
        <Text textAlign="center" mt={4}>
          Something went wrong... Please try reload the page
        </Text>
      ) : (
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
        />
      )}
    </Layout>
  );
}

export default ProjectsPage;
