import { Hero } from '@/components/Hero';
import Head from 'next/head';
import { Container } from '@/components/Container';
import { Header } from '@/components/Header';
import { Main } from '@/components/Main';
import { Footer } from '@/components/Footer';

export const projectName = 'MW Issue Tracker';

function Home() {
  return (
    <>
      <Head>
        <title>MW Issue Tracker</title>
      </Head>

      <Container>
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
