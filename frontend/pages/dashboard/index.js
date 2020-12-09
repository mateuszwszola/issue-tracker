import { Flex, Heading, Text, Box, SkeletonCircle, SkeletonText, Avatar } from '@chakra-ui/react';
import { Layout } from '@/components/Layout';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useApiUser } from 'contexts/api-user-context';

function Dashboard() {
  const { error } = useAuth0();
  const { user } = useApiUser();

  return (
    <Layout title="Dashboard">
      <Box mt={{ base: 8, md: 16 }}>
        {error ? (
          <Text textAlign="center">Something went wrong... Sorry</Text>
        ) : !user ? (
          <>
            <SkeletonCircle size="12" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" />
          </>
        ) : (
          <>
            <Flex>
              <Avatar size="lg" name={user.name} src={user.picture} />
              <Box ml={4}>
                <Heading as="h2" fontSize="3xl" fontWeight="semibold">
                  {user.name}
                </Heading>
              </Box>
            </Flex>
          </>
        )}
      </Box>
    </Layout>
  );
}

export default withAuthenticationRequired(Dashboard);
