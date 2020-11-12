import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { BackButton } from '@/components/BackButton';
import { Box, Heading, Spinner } from '@chakra-ui/core';
import useSWR from 'swr';
import { getProjectTickets } from 'utils/projects-client';

function Project() {
  const router = useRouter();
  const { key } = router.query;
  const { data, error } = useSWR(key ? ['tickets', key] : null, () => getProjectTickets(key));

  return (
    <Layout>
      <Box>
        <BackButton>Go back to projects</BackButton>
        <Heading mt={2}>{key}</Heading>
        {error ? (
          <div>Something went wrong...</div>
        ) : !data ? (
          <Spinner />
        ) : (
          <Box>{JSON.stringify(data?.tickets, null, 2)}</Box>
        )}
      </Box>
    </Layout>
  );
}

export default Project;
