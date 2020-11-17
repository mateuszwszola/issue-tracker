import useSWR from 'swr';
import { Spinner } from '@chakra-ui/core';
import { Projects } from '@/components/Projects';
import { Layout } from '@/components/Layout';
import { getProjects } from 'utils/projects-client';

function ProjectsPage() {
  const { data, error } = useSWR('projects', getProjects);

  return (
    <Layout title="Projects">
      {error ? (
        <div>Something went wrong... Please try reload the page</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <Projects data={data?.projects || []} />
      )}
    </Layout>
  );
}

export default ProjectsPage;
