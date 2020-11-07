import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { useFetchUser } from 'utils/user';

export const projectName = 'IssueTracker';

function Home() {
  const { user, loading } = useFetchUser();

  return (
    <Layout withOverlay user={user} loading={loading}>
      <Hero />
    </Layout>
  );
}

export default Home;
