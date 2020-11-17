import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { BackButton } from '@/components/BackButton';
import { Box, Heading, Spinner } from '@chakra-ui/core';
import useSWR from 'swr';
import { getProjectTickets } from 'utils/tickets-client';

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
          <Box>
            {data?.tickets?.map((ticket) => (
              <Box key={ticket?.id}>{ticket?.name}</Box>
            ))}
          </Box>
        )}
      </Box>
    </Layout>
  );
}

export default Project;
