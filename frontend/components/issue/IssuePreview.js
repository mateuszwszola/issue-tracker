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
import PropTypes from 'prop-types';
import { NextButtonLink } from '@/components/Link';
import { format } from 'date-fns';

function IssuePreview({ isLoading, issue, children, ...chakraProps }) {
  const cardBorderColor = useColorModeValue('gray.300', 'gray.900');
  const dividerColor = useColorModeValue('gray.200', 'gray.700');
  const secondaryColor = useColorModeValue('gray.500', 'gray.500');

  return (
    <Flex
      {...chakraProps}
      direction={{ base: 'column', md: 'row-reverse' }}
      justify={{ md: 'space-between' }}
    >
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
                  <NextButtonLink href={`/project/${issue?.project?.key}`}>
                    {issue?.project?.name}
                  </NextButtonLink>
                </Text>
                <Text>{issue?.type?.name}</Text>
                <Text>{issue?.status?.name}</Text>
                <Text>{issue?.priority?.name}</Text>
                <Text>
                  <NextButtonLink href={`/user/${issue?.assignee?.id}`}>
                    {issue?.assignee?.name}
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
                  <Text>Created {format(new Date(issue.created_at), 'MMM dd, yyyy')}</Text>

                  {issue.updatedBy && (
                    <Text mt={2}>Updated {format(new Date(issue.updated_at), 'MMM dd, yyyy')}</Text>
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
          <>{children}</>
        )}
      </Box>
    </Flex>
  );
}

IssuePreview.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  issue: PropTypes.object,
  children: PropTypes.node.isRequired
};

export default IssuePreview;
