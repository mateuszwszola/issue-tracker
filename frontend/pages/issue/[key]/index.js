import { BackButton } from '@/components/BackButton';
import { Layout } from '@/components/Layout';
import { Box, Flex, Heading, Skeleton, Text, Link, Stack, StackDivider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher from '@/utils/api-client';
import { objToQueryString } from '@/utils/query-string';
import { formatDistanceToNow } from 'date-fns';
import NextLink from 'next/link';

function getIssueIdFromKey(issueKey) {
  return issueKey.split('-').slice(-1)[0];
}

const queryString = objToQueryString({
  withGraph:
    '[type, status, priority, assignee, createdBy, updatedBy, comments, project, subTicket]'
});

function Issue() {
  const router = useRouter();
  const { key: issueKey } = router.query;
  const issueId = issueKey && getIssueIdFromKey(issueKey);

  const { data, error } = useSWR(issueId ? `tickets/${issueId}?${queryString}` : null, fetcher);

  const ticket = data?.ticket;

  return (
    <Layout>
      <Box>
        <BackButton disabled={!ticket}>Go back</BackButton>
      </Box>
      {error ? (
        <Text textAlign="center">Something went wrong...</Text>
      ) : !ticket ? (
        <>
          <Skeleton height="50px" />
        </>
      ) : (
        <Box mt={6}>
          <Flex wrap="wrap" align="baseline" color="gray.500" fontSize="sm">
            <Text mr={3} as="span" fontWeight="semibold">
              {issueKey}
            </Text>
            <Text mr={3} as="span">
              Created by{' '}
              <NextLink href={`/user/${encodeURIComponent(ticket.createdBy?.sub)}`} passHref>
                <Link color="blue.500" fontWeight="semibold">
                  {ticket.createdBy?.name}
                </Link>
              </NextLink>{' '}
              {formatDistanceToNow(new Date(ticket.created_at))} ago
            </Text>

            {ticket.updatedBy && (
              <Text as="span">
                Updated by{' '}
                <NextLink href={`/user/${encodeURIComponent(ticket.updatedBy?.sub)}`} passHref>
                  <Link color="blue.500" fontWeight="semibold">
                    {ticket.updatedBy?.name}
                  </Link>
                </NextLink>{' '}
                {formatDistanceToNow(new Date(ticket.updated_at))} ago
              </Text>
            )}
          </Flex>

          <Flex mt={2} direction={{ base: 'column', md: 'row-reverse' }}>
            <Stack flex={{ base: 1, md: 1 }} spacing={4} bgColor="gray.600" p={4} maxWidth="600px">
              <Heading as="h3" fontSize="lg">
                About
              </Heading>
              <Text>Project {ticket.project?.name}</Text>
              <Text>Type {ticket.type?.name}</Text>
              <Text>Status {ticket.status?.name}</Text>
              <Text>Priority {ticket.priority?.name}</Text>
              <Text>Assignee {ticket.assignee?.name}</Text>
            </Stack>
            <Box flex={{ base: 1, md: 2, lg: 3 }} mt={[2, 0]} pr={{ md: 8 }}>
              <Box maxWidth="600px">
                <Heading as="h2" fontSize="2xl">
                  {ticket.name}
                </Heading>
                {ticket.description && <Text mt={2}>{ticket.description}</Text>}
              </Box>
            </Box>
          </Flex>
        </Box>
      )}
    </Layout>
  );
}

export default Issue;
