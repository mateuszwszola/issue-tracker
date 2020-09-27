import Head from 'next/head';
import { Container } from '@/components/Container';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Main } from '@/components/Main';
import { Projects } from '@/components/Projects';

function ProjectsPage() {
  return (
    <>
      <Head>
        <title>Projects | Issue Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header />
        <Main>
          <Projects />
        </Main>
        <Footer />
      </Container>
    </>
  );
}

export default ProjectsPage;