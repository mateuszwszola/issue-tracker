import { BackButton } from '@/components/BackButton';
import { Layout } from '@/components/Layout';
import fetcher from '@/utils/api-client';
import { objToQueryString } from '@/utils/query-string';
import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const queryString = objToQueryString({
  withGraph: '[managedProjects, engineeredProjects]'
});

function ProfilePage() {
  const router = useRouter();
  const { userId } = router.query;
  const { data, error } = useSWR(userId ? `profiles/${userId}?${queryString}` : null, fetcher);
  const profile = data?.profile;
  const isLoading = !error && !profile;

  return (
    <Layout>
      <Box>
        <BackButton disabled={isLoading}>Go back</BackButton>
      </Box>
      <Box mt={{ base: 8, md: 16 }}>
        {error ? (
          <Text textAlign="center">Something went wrong... Sorry</Text>
        ) : isLoading ? (
          <Box>Loading...</Box>
        ) : (
          <>Profile Page</>
        )}
      </Box>
    </Layout>
  );
}

export default ProfilePage;
