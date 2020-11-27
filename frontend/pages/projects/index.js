import { useSWRInfinite } from 'swr';
import { Text } from '@chakra-ui/react';
import { Projects } from '@/components/Projects';
import { Layout } from '@/components/Layout';
import { getProjects } from 'utils/projects-client';

const PAGE_SIZE = 4;

const getKey = (pageIndex) => {
  return `projects?page=${pageIndex}&limit=${PAGE_SIZE}`;
};

function ProjectsPage() {
  const { data, isValidating, size, setSize, error } = useSWRInfinite(getKey, getProjects);

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
        />
      )}
    </Layout>
  );
}

export default ProjectsPage;
