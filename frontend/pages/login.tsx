import Head from 'next/head';
import { Container } from '@/components/Container';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Main } from '@/components/Main';

function Login(): JSX.Element {
  return (
    <>
      <Head>
        <title>Sign In | Issue Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header />
        <Main>
          <h1>Login</h1>
        </Main>
        <Footer />
      </Container>
    </>
  );
}

export default Login;
