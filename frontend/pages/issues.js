import Head from 'next/head';
import { Container } from '@/components/Container';
import { Main } from '@/components/Main';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Issues } from '@/components/Issues';

function IssuesPage() {
  return (
    <>
      <Head>
        <title>Issues | Issue Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header />
        <Main>
          <Issues />
        </Main>
        <Footer />
      </Container>
    </>
  );
}

export default IssuesPage;
