import Head from 'next/head';
import { Container } from '@/components/Container';
import { Main } from '@/components/Main';
import { Hero } from '@/components/Hero';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const projectName = 'IssueTracker';

function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Issue Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container withOverlay>
        <Header />
        <Main>
          <Hero />
        </Main>
        <Footer />
      </Container>
    </>
  );
}

export default Home;
