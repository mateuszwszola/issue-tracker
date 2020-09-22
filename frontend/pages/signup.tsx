import Head from 'next/head';
import { Flex } from '@chakra-ui/core';
import { Container } from '@/components/Container';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Main } from '@/components/Main';
import { Auth } from '@/components/Auth';

function Signup(): JSX.Element {
  return (
    <>
      <Head>
        <title>Sign Up | Issue Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header />
        <Main>
          <Flex flex={1} justify="center" align="center">
            <Auth signin={false} />
          </Flex>
        </Main>
        <Footer />
      </Container>
    </>
  );
}

export default Signup;
