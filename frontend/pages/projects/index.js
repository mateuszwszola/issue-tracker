import useSWR from 'swr';
import { Text } from '@chakra-ui/react';
import { Projects } from '@/components/Projects';
import { Layout } from '@/components/Layout';
import { getProjects } from 'utils/projects-client';

function ProjectsPage() {
  const { data, error } = useSWR('projects', getProjects);

  return (
    <Layout title="Projects">
      {error ? (
        <Text textAlign="center" mt={4}>
          Something went wrong... Please try reload the page
        </Text>
      ) : (
        <Projects data={data} />
      )}
    </Layout>
  );
}

export default ProjectsPage;
