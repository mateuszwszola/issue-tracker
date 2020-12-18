import { Heading, Text, Box, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { Layout } from '@/components/Layout';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { useUser } from '@/hooks/use-user';

function Profile() {
  const { user, loading, error } = useUser();

  return (
    <Layout title="Settings">
      <Box mt={{ base: 8, md: 16 }}>
        {error ? (
          <Text textAlign="center">Something went wrong... Sorry</Text>
        ) : loading ? (
          <>
            <SkeletonCircle size="12" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" />
          </>
        ) : (
          <>
            <Heading as="h2" fontSize="3xl" fontWeight="semibold">
              Profile {user.name}
            </Heading>
          </>
        )}
      </Box>
    </Layout>
  );
}

export default withAuthenticationRequired(Profile);
