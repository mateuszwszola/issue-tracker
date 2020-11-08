import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';

export const projectName = 'IssueTracker';

function Home() {
  return (
    <Layout withOverlay>
      <Hero />
    </Layout>
  );
}

export default Home;
