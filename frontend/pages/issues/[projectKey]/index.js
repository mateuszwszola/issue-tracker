import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { BackButton } from '@/components/BackButton';
import { Box, Flex, Heading, Spinner, StackDivider, Text, VStack } from '@chakra-ui/core';
import useSWR from 'swr';
import { getProjectTickets } from 'utils/tickets-client';

function Project() {
  const router = useRouter();
  const { projectKey } = router.query;
  const { data, error } = useSWR(projectKey ? ['tickets', projectKey] : null, () =>
    getProjectTickets(projectKey)
  );

  return (
    <Layout>
      <Box>
        <BackButton>Go back to project</BackButton>
        <Heading mt={2}>Issues for project: {projectKey}</Heading>
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
                  <Box flex={1}>
                    <Text fontSize="sm">{ticket?.type?.name}</Text>
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="sm">{ticket?.status?.name}</Text>
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="sm">{ticket?.priority?.name}</Text>
                  </Box>
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
