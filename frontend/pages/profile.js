import Head from 'next/head';
import { Flex, Heading, Text, Img } from '@chakra-ui/core';
import { Container } from '@/components/Container';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Main } from '@/components/Main';
import { useFetchUser } from '../utils/user';

function Profile() {
  const { user, loading } = useFetchUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Container>
        <Header />
        <Main>
          <Flex flex={1} justify="center" align="center">
            {user ? (
              <>
                <Img src={user?.picture} alt={`${user?.name}`} />
                <Heading>{user?.name}</Heading>
                <Text>{user?.email}</Text>
              </>
            ) : (
              <p>You are not authenticated my friend</p>
            )}
          </Flex>
        </Main>
        <Footer />
      </Container>
    </>
  );
}

export default Profile;
