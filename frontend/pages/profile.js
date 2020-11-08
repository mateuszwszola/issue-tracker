import { Flex, Heading, Text, Img } from '@chakra-ui/core';
import { Layout } from '@/components/Layout';
import { useAuth0 } from '@auth0/auth0-react';

function Profile() {
  const { user, isLoading } = useAuth0();

  return (
    <Layout title="Profile">
      <Flex flex={1} justify="center" align="center">
        {!isLoading && user ? (
          <>
            <Img src={user?.picture} alt={`${user?.name}`} />
            <Heading>{user?.name}</Heading>
            <Text>{user?.email}</Text>
          </>
        ) : (
          <p>You are not authenticated my friend</p>
        )}
      </Flex>
    </Layout>
  );
}

export default Profile;
