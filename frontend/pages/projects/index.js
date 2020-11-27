import { useState, useCallback } from 'react';
import { useSWRInfinite } from 'swr';
import { Text } from '@chakra-ui/react';
import { Projects } from '@/components/Projects';
import { Layout } from '@/components/Layout';
import { getProjects } from 'utils/projects-client';

const PAGE_SIZE = 4;

function parseOrderByQueryObject(orderByObj) {
  return Object.keys(orderByObj)
    .filter((order) => orderByObj[order])
    .map((order) => `${order}:${orderByObj[order]}`)
    .join(',');
}

function ProjectsPage() {
  const [orderBy, setOrderBy] = useState({
    name: '',
    key: '',
    manager_id: ''
  });

  const getKey = useCallback(
    (pageIndex) => {
      const orders = parseOrderByQueryObject(orderBy);

      return `projects?page=${pageIndex}&limit=${PAGE_SIZE}${orders ? `&orderBy=${orders}` : ''}`;
    },
    [orderBy]
  );

  const { data, isValidating, size, setSize, error } = useSWRInfinite(getKey, getProjects);

  const handleOrderByButtonClick = (column) => () => {
    setOrderBy((prev) => ({
      ...prev,
      [column]: prev[column] === 'asc' ? 'desc' : 'asc'
    }));
  };

  const fetchMore = () => setSize(size + 1);

  const projects = data ? [].concat(...data.map(({ projects }) => projects)) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.projects?.length === 0;
  const isReachingEnd = !!(
    isEmpty ||
    (data && data[data.length - 1]?.projects?.length < PAGE_SIZE)
  );
  const isRefreshing = !!(isValidating && data && data.length === size);

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
