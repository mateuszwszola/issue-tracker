import Head from 'next/head';
import { Container } from '@/components/Container';
import { Main } from '@/components/Main';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function Issues() {
  return (
    <>
      <Head>
        <title>Issues | Issue Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header />
        <Main>
          <h1>Issues</h1>
        </Main>
        <Footer />
      </Container>
    </>
  );
}

export default Issues;
