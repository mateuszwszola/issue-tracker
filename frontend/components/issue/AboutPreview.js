import { Box, Flex, Heading, Skeleton, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { NextButtonLink } from '@/components/Link';
import { format } from 'date-fns';

function IssueAboutPreview({ isLoading, ticket }) {
  const cardBorderColor = useColorModeValue('gray.300', 'gray.900');
  const dividerColor = useColorModeValue('gray.200', 'gray.700');
  const secondaryColor = useColorModeValue('gray.500', 'gray.500');

  return (
    <Box w="full" maxW={{ md: '400px' }}>
      <Heading pl={{ md: 4 }} as="h3" fontSize="2xl">
        About
      </Heading>

      <Skeleton isLoaded={!isLoading}>
        <Box mt={3} p={[4, 6]} rounded="md" shadow="md" border="1px" borderColor={cardBorderColor}>
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
                <Text>Created {format(new Date(ticket.created_at), 'MMM dd, yyyy')}</Text>

                {ticket.updatedBy && (
                  <Text mt={2}>Updated {format(new Date(ticket.updated_at), 'MMM dd, yyyy')}</Text>
                )}
              </>
            )}
          </Box>
        </Box>
      </Skeleton>
    </Box>
  );
}

IssueAboutPreview.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  ticket: PropTypes.object.isRequired
};

export default IssueAboutPreview;
