import { Layout } from '@/components/Layout';
import fetcher from '@/utils/api-client';
import { objToQueryString } from '@/utils/query-string';
import {
  Box,
  Flex,
  Heading,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { format, formatDistanceToNow } from 'date-fns';
import useSWR from 'swr';
import { NextButtonLink } from '@/components/Link';
import { useRouter } from 'next/router';

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
  const isLoading = !error && !ticket;

  const cardBorderColor = useColorModeValue('gray.300', 'gray.900');
  const dividerColor = useColorModeValue('gray.200', 'gray.700');
  const secondaryColor = useColorModeValue('gray.500', 'gray.500');

  return (
    <Layout title={`Issue ${issueKey}`}>
      <Box mt={{ base: 8, md: 16 }}>
        {error ? (
          <Text textAlign="center">Something went wrong... Sorry</Text>
        ) : (
          <Flex direction={{ base: 'column', md: 'row-reverse' }} justify={{ md: 'space-between' }}>
            <Box w="full" maxW={{ md: '400px' }}>
              <Heading pl={{ md: 4 }} as="h3" fontSize="2xl">
                About
              </Heading>

              <Skeleton isLoaded={!isLoading}>
                <Box
                  mt={3}
                  p={[4, 6]}
                  rounded="md"
                  shadow="md"
                  border="1px"
                  borderColor={cardBorderColor}
                >
                  <Flex>
                    <Stack flex={1 / 2} spacing={4}>
                      <Text>Project</Text>
                      <Text>Type</Text>
                      <Text>State</Text>
                      <Text>Priority</Text>
                      <Text>Assignee</Text>
                    </Stack>

                    <Stack flex={1 / 2} spacing={4}>
                      <Text>
                        <NextButtonLink href={`/project/${ticket?.project?.key}`}>
                          {ticket?.project?.name}
                        </NextButtonLink>
                      </Text>
                      <Text>{ticket?.type?.name}</Text>
                      <Text>{ticket?.status?.name}</Text>
                      <Text>{ticket?.priority?.name}</Text>
                      <Text>
                        <NextButtonLink href={`/user/${ticket?.assignee?.id}`}>
                          {ticket?.assignee?.name}
                        </NextButtonLink>
                      </Text>
                    </Stack>
                  </Flex>

                  <Box
                    mt={6}
                    pt={[2, 4]}
                    borderTop="1px"
                    borderColor={dividerColor}
                    color={secondaryColor}
                    fontSize="sm"
                  >
                    {!isLoading && (
                      <>
                        <Text>Created {format(new Date(ticket.created_at), 'MMMM M, yyyy')}</Text>

                        {ticket.updatedBy && (
                          <Text mt={2}>
                            Updated {format(new Date(ticket.updated_at), 'MMMM M, yyyy')}
                          </Text>
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              </Skeleton>
            </Box>

            <Box mt={{ base: 6, md: 0 }} pr={{ md: 8 }} w="full" maxW={{ md: '640px' }}>
              {isLoading ? (
                <Box py={4}>
                  <SkeletonText noOfLines={3} />
                </Box>
              ) : (
                <>
                  <Flex wrap="wrap" align="baseline" color={secondaryColor} fontSize="sm">
                    <Text mr={3} as="span" fontWeight="semibold">
                      {issueKey}
                    </Text>

                    {ticket.createdBy && (
                      <Text mr={3} as="span" display="flex" alignItems="center">
                        Created by
                        <NextButtonLink
                          href={`/user/${encodeURIComponent(ticket.createdBy.id)}`}
                          fontSize="sm"
                          mx={1}
                        >
                          {ticket.createdBy.name}
                        </NextButtonLink>
                        {formatDistanceToNow(new Date(ticket.created_at))} ago
                      </Text>
                    )}

                    {ticket.updatedBy && (
                      <Text as="span" display="flex" alignItems="center">
                        Updated by
                        <NextButtonLink
                          href={`/user/${encodeURIComponent(ticket.updatedBy.id)}`}
                          fontSize="sm"
                          mx={1}
                        >
                          {ticket.updatedBy.name}
                        </NextButtonLink>
                        {formatDistanceToNow(new Date(ticket.updated_at))} ago
                      </Text>
                    )}
                  </Flex>

                  <Heading mt={3} as="h2" fontSize="2xl">
                    {ticket.name}
                  </Heading>

                  {ticket.description && <Text mt={2}>{ticket.description}</Text>}
                </>
              )}

              <Box mt={8}>
                <Text fontSize="sm" fontWeight="medium">
                  Attachments {isLoading ? '...' : 0}
                </Text>
              </Box>

              <Box mt={12} borderTop="1px" borderColor={dividerColor}>
                <Text mt={2} textAlign="right" color={secondaryColor} fontSize="sm">
                  Comments ({isLoading ? '...' : ticket.comments?.length})
                </Text>
              </Box>
            </Box>
          </Flex>
        )}
      </Box>
    </Layout>
  );
}

export default Issue;
