import { Flex, Heading, Text, Img } from '@chakra-ui/core';
import { Layout } from '@/components/Layout';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';

function Profile() {
  const { user } = useAuth0();

  return (
    <Layout title="Profile">
      <Flex flex={1} justify="center" align="center">
        <Img src={user?.picture} alt={`${user?.name}`} />
        <Heading>{user?.name}</Heading>
        <Text _selected={{ background: 'red' }}>{user?.email}</Text>
      </Flex>
    </Layout>
  );
}

export default withAuthenticationRequired(Profile);
