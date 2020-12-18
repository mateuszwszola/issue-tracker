import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';
import Router from 'next/router';
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const projectName = 'MW_Issue_Tracker';

function Home() {
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      Router.replace('/dashboard');
    }
  }, [isAuthenticated]);

  return (
    <Layout withOverlay>
      <Hero />
    </Layout>
  );
}

export default Home;
