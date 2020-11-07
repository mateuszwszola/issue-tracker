import { Projects } from '@/components/Projects';
import { Layout } from '@/components/Layout';
import { useFetchUser } from 'utils/user';

function ProjectsPage() {
  const { user, loading } = useFetchUser();

  return (
    <Layout user={user} loading={loading} title="Projects">
      <Projects />
    </Layout>
  );
}

export default ProjectsPage;
