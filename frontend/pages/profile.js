import { Flex, Heading, Text, Img } from '@chakra-ui/core';
import { useFetchUser } from '../utils/user';
import { Layout } from '@/components/Layout';

function Profile() {
  const { user, loading } = useFetchUser();

  return (
    <Layout user={user} loading={loading} title="Profile">
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
    </Layout>
  );
}

export default Profile;
