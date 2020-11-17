import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { BackButton } from '@/components/BackButton';
import { Avatar, Box, Flex, Heading, Spinner, StackDivider, Text, VStack } from '@chakra-ui/core';
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
          <VStack mt={2} divider={<StackDivider borderColor="gray.200" />} align="stretch">
            {data?.tickets?.map((ticket) => (
              <Box px={2} key={ticket?.id}>
                <Text>{ticket?.name}</Text>
                <Flex>
                  <Box flex={1}>{ticket?.type?.name}</Box>
                  <Box flex={1}>{ticket?.status?.name}</Box>
                  <Box flex={1}>{ticket?.priority?.name}</Box>
                  <Avatar size="xs" />
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Layout>
  );
}

export default Project;
