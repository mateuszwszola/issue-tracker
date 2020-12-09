import { Heading, Text, Box, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { Layout } from '@/components/Layout';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useApiUser } from 'contexts/api-user-context';

function Settings() {
  const { error } = useAuth0();
  const { user } = useApiUser();

  return (
    <Layout title="Settings">
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
            <Heading as="h2" fontSize="3xl" fontWeight="semibold">
              Settings
            </Heading>
          </>
        )}
      </Box>
    </Layout>
  );
}

export default withAuthenticationRequired(Settings);
