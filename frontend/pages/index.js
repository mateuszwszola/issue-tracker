import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';

export const projectName = 'MW_Issue_Tracker';

function Home() {
  return (
    <Layout withOverlay>
      <Hero />
    </Layout>
  );
}

export default Home;
