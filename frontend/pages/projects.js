import useSWR from 'swr';
import { Spinner, useToast } from '@chakra-ui/core';
import { Projects } from '@/components/Projects';
import { Layout } from '@/components/Layout';
import { getProjects } from 'utils/projects-client';

function ProjectsPage() {
  const { data, error } = useSWR('projects', getProjects);
  const toast = useToast();

  return (
    <Layout title="Projects">
      {error ? (
        toast({
          title: 'Something went wrong...',
          description: error?.message,
          status: 'error'
        })
      ) : !data ? (
        <Spinner />
      ) : (
        <Projects data={data?.projects || []} />
      )}
    </Layout>
  );
}

export default ProjectsPage;
