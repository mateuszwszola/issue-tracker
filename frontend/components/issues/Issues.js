import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Link,
  SimpleGrid,
  Skeleton,
  Stack,
  StackDivider,
  Text,
  Tooltip,
  VStack
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaRegCommentAlt } from 'react-icons/fa';
import { format, isToday } from 'date-fns';
import PropTypes from 'prop-types';
import { getProjectKeyFromTicketKey } from '@/utils/helpers';

export const ticketPriorityColors = {
  Normal: null,
  Major: 'orange',
  Critical: 'red'
};

export const ticketTypeColors = {
  Task: 'blue',
  Feature: 'green',
  Bug: 'red'
};

export const ticketStatusColors = {
  Submitted: null,
  Open: 'blue',
  'In Progress': 'orange',
  Fixed: 'green',
  Closed: null
};

export const Issues = ({
  tickets,
  isLoadingInitialData,
  isLoadingMore,
  size,
  isEmpty,
  isReachingEnd,
  fetchMore
}) => {
  return (
    <>
      {isLoadingInitialData ? (
        <Stack>
          <Skeleton height="50px" />
          <Skeleton height="50px" />
          <Skeleton height="50px" />
        </Stack>
      ) : isEmpty ? (
        <Text textAlign="center" my={4}>
          No issues found
        </Text>
      ) : (
        <VStack
          overflowX="auto"
          as="ul"
          divider={<StackDivider />}
          width="100%"
          align="stretch"
          spacing={[3, 2]}
        >
          {tickets.map((ticket) => {
            const done =
              ticket.status && (ticket.status.name === 'Fixed' || ticket.status.name === 'Closed');

            const updatedAt = new Date(ticket.updated_at);
            const createdAt = new Date(ticket.created_at);

            const projectKey = getProjectKeyFromTicketKey(ticket.key);

            return (
              <Box as="li" key={ticket.id}>
                <Flex align="center" justify="space-between" wrap="wrap">
                  <Flex align="center" flexShrink={0}>
                    <NextLink href={`/project/${encodeURIComponent(projectKey)}`} passHref>
                      <Link textDecoration={done ? 'line-through' : 'none'} fontSize="sm">
                        {ticket.key}
                      </Link>
                    </NextLink>

                    <NextLink href={`/issue/${encodeURIComponent(ticket.key)}`} passHref>
                      <Button as="a" ml={3} colorScheme="blue" size="sm" variant="link">
                        {ticket.name}
                      </Button>
                    </NextLink>
                  </Flex>

                  {ticket.comments?.length > 0 && (
                    <Flex align="center" color="gray.500">
                      <Text>{ticket.comments?.length}</Text>
                      <Icon ml={1} as={FaRegCommentAlt} />
                    </Flex>
                  )}
                </Flex>

                <SimpleGrid mt={[3, null, null, 6]} columns={[2, 3, 4, 6]} spacingY={1}>
                  <Box>
                    <Tooltip label="Priority">
                      <Badge
                        fontSize="xs"
                        colorScheme={ticketPriorityColors[ticket.priority?.name]}
                      >
                        {ticket.priority?.name}
                      </Badge>
                    </Tooltip>
                  </Box>

                  <Box>
                    <Tooltip label="Assignee">
                      <Text as="span" fontSize="sm">
                        {ticket.assignee?.name || 'Unassigned'}
                      </Text>
                    </Tooltip>
                  </Box>

                  <Box>
                    <Tooltip label="Type">
                      <Badge fontSize="xs" colorScheme={ticketTypeColors[ticket.type?.name]}>
                        {ticket.type?.name}
                      </Badge>
                    </Tooltip>
                  </Box>

                  <Box>
                    <Tooltip label="State">
                      <Badge fontSize="xs" colorScheme={ticketStatusColors[ticket.status?.name]}>
                        {ticket.status?.name}
                      </Badge>
                    </Tooltip>
                  </Box>

                  <Box>
                    <Tooltip label="Created by">
                      <Text fontSize="sm" mr={3}>
                        {ticket.createdBy?.name}
                      </Text>
                    </Tooltip>
                  </Box>

                  <Flex justify={{ lg: 'flex-end' }}>
                    {ticket.updatedBy ? (
                      <Tooltip
                        label={`Updated by ${ticket.updatedBy?.name} on ${format(
                          updatedAt,
                          'MMM dd, yyyy HH:mm'
                        )}`}
                      >
                        <Text fontSize="sm" color="gray.500">
                          {isToday(updatedAt) ? (
                            <>{format(updatedAt, 'HH:mm')}</>
                          ) : (
                            <>{format(updatedAt, 'MMM dd')}</>
                          )}
                        </Text>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        label={`Created by ${ticket.createdBy?.name} on ${format(
                          createdAt,
                          'MMM dd, yyyy HH:mm'
                        )}`}
                      >
                        <Text fontSize="sm" color="gray.500">
                          {isToday(createdAt) ? (
                            <>{format(createdAt, 'HH:mm')}</>
                          ) : (
                            <>{format(createdAt, 'MMM dd')}</>
                          )}
                        </Text>
                      </Tooltip>
                    )}
                  </Flex>
                </SimpleGrid>
              </Box>
            );
          })}

          <Flex
            mt={[1, 2]}
            direction={['column-reverse', 'row']}
            align="center"
            justify="space-between"
          >
            <Button
              mt={[3, 0]}
              disabled={isLoadingMore || isReachingEnd}
              onClick={fetchMore}
              size="sm"
              variant="outline"
              colorScheme="blue"
            >
              Show more issues
            </Button>

            <Text fontSize="sm" textAlign="right" color="gray.500" fontWeight="medium">
              Showing {size} page(s) of {isLoadingMore ? '...' : tickets.length} issues
            </Text>
          </Flex>
        </VStack>
      )}
    </>
  );
};

Issues.propTypes = {
  tickets: PropTypes.array.isRequired,
  isLoadingInitialData: PropTypes.bool.isRequired,
  isLoadingMore: PropTypes.bool.isRequired,
  isReachingEnd: PropTypes.bool.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  fetchMore: PropTypes.func.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  size: PropTypes.number.isRequired
};
