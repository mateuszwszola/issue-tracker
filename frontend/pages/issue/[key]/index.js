import { BackButton } from '@/components/BackButton';
import { Layout } from '@/components/Layout';
import { Box, Flex, Heading, Skeleton, Text, Link, Stack, Divider, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher from '@/utils/api-client';
import { objToQueryString } from '@/utils/query-string';
import { format, formatDistanceToNow } from 'date-fns';
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
        <Box mt={8}>
          <Flex direction={{ base: 'column', md: 'row-reverse' }}>
            <Box flex={1} w="full" maxWidth="400px">
              <Heading pl={{ md: 4 }} as="h3" fontSize="2xl">
                About
              </Heading>

              <Box mt={3} px={4} py={6} rounded="md" shadow="md" bgColor="black">
                <Flex>
                  <Stack flex="50%" spacing={4}>
                    <Text>Project</Text>
                    <Text>Type</Text>
                    <Text>State</Text>
                    <Text>Priority</Text>
                    <Text>Assignee</Text>
                  </Stack>
                  <Stack flex="50%" spacing={4}>
                    <Text>{ticket.project?.name}</Text>
                    <Text>{ticket.type?.name}</Text>
                    <Text>{ticket.status?.name}</Text>
                    <Text>{ticket.priority?.name}</Text>
                    <Text>{ticket.assignee?.name}</Text>
                  </Stack>
                </Flex>

                <Box mt={6} borderTop="1px" borderColor="gray.700">
                  <Text mt={2} fontSize="sm" color="gray.500">
                    Created {format(new Date(ticket.created_at), 'MMMM M, yyyy')}
                  </Text>
                  {ticket.updatedBy && (
                    <Text mt={2} fontSize="sm" color="gray.500">
                      Updated {format(new Date(ticket.updated_at), 'MMMM M, yyyy')}
                    </Text>
                  )}
                </Box>
              </Box>
            </Box>

            <Box flex={{ base: 1, lg: 2 }} w="full" mt={{ base: 6, md: 0 }} pr={{ md: 8 }}>
              <Box maxWidth="600px">
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
                      <NextLink
                        href={`/user/${encodeURIComponent(ticket.updatedBy?.sub)}`}
                        passHref
                      >
                        <Link color="blue.500" fontWeight="semibold">
                          {ticket.updatedBy?.name}
                        </Link>
                      </NextLink>{' '}
                      {formatDistanceToNow(new Date(ticket.updated_at))} ago
                    </Text>
                  )}
                </Flex>

                <Heading mt={1} as="h2" fontSize="2xl">
                  {ticket.name}
                </Heading>
                {ticket.description && <Text mt={2}>{ticket.description}</Text>}

                <Box mt={12} borderTop="1px" borderColor="gray.700">
                  <Text mt={2} textAlign="right" color="gray.500" fontSize="sm">
                    Comments ({ticket.comments?.length})
                  </Text>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Box>
      )}
    </Layout>
  );
}

export default Issue;
