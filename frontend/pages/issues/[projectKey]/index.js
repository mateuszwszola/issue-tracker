import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Layout } from '@/components/Layout';
import { BackButton } from '@/components/BackButton';
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Skeleton,
  Stack,
  Text
} from '@chakra-ui/react';
import useSWR from 'swr';
import { InputSearch } from '@/components/InputSearch';
import { objToQueryString } from '@/utils/query-string';
import { FilterMenu } from '@/components/issues/FilterMenu';
import { getProjectIdFromProjectKey } from '@/utils/projects-client';
import fetcher from '@/utils/api-client';

const ticketStatusColors = {
  Normal: 'gray',
  Major: 'orange',
  Critical: 'red'
};

function getQueryString(projectId) {
  return objToQueryString({
    projectId,
    withGraph: '[type, status, priority, assignee, createdBy, updatedBy, comments]'
  });
}

function ProjectIssuesPage() {
  const router = useRouter();
  const { projectKey } = router.query;
  const projectId = projectKey && getProjectIdFromProjectKey(projectKey);

  const { data, error } = useSWR(
    projectId ? `tickets?${getQueryString(projectId)}` : null,
    fetcher
  );

  return (
    <Layout>
      <Box>
        <BackButton>Go back</BackButton>
        <Heading as="h2" fontSize="xl" mt={2}>
          Issues for: {projectKey}
        </Heading>
      </Box>

      <Flex mt={1} direction={['column', null, 'row']} align={{ sm: 'center' }}>
        <Box w="full" maxW={['100%', 'xs']}>
          <InputSearch />
        </Box>

        <SimpleGrid mt={{ base: 2, md: 0 }} ml={{ md: 4 }} columns={[2, 4]} spacing={1}>
          <Box>
            <FilterMenu label="Assignee" options={['User #1', 'User #2']} />
          </Box>
          <Box>
            <FilterMenu label="Priority" options={['P1', 'P2', 'P3', 'P4', 'P5']} />
          </Box>
          <Box>
            <FilterMenu label="Status" options={['To Do', 'In Progress', 'Done']} />
          </Box>
          <Box width="auto">
            <FilterMenu label="Type" options={['Task', 'Bug', 'Feature Request']} />
          </Box>
        </SimpleGrid>
      </Flex>

      <Box mt={8}>
        {error ? (
          <Text>Something went wrong... Try reload the page</Text>
        ) : (
          <Flex direction="column" align="stretch" overflowX="auto">
            {!data ? (
              <Stack>
                <Skeleton height="50px" />
                <Skeleton height="50px" />
                <Skeleton height="50px" />
              </Stack>
            ) : (
              <>
                {data.tickets?.map((ticket) => {
                  const fixed = ticket.status?.name === 'Fixed';

                  return (
                    <Box key={ticket.id}>
                      <Box py={2}>
                        <Flex align="center">
                          <NextLink href={`/issue/${encodeURIComponent(ticket.key)}`} passHref>
                            <Link textDecoration={fixed ? 'line-through' : 'none'} fontSize="sm">
                              {ticket.key}
                            </Link>
                          </NextLink>
                          <NextLink href={`/issue/${encodeURIComponent(ticket.key)}`} passHref>
                            <Button as="a" ml={3} colorScheme="blue" size="sm" variant="link">
                              {ticket.name}
                            </Button>
                          </NextLink>
                        </Flex>
                        <Flex mt={2}>
                          <Box flex={1}>
                            <Badge
                              fontSize="xs"
                              colorScheme={ticketStatusColors[ticket.priority?.name]}
                            >
                              {ticket.priority?.name}
                            </Badge>
                          </Box>
                          <Box flex={1}>
                            <Badge fontSize="xs" colorScheme="green">
                              {ticket.type?.name}
                            </Badge>
                          </Box>
                          <Box flex={1}>
                            <Badge fontSize="xs" colorScheme="blue">
                              {ticket.status?.name}
                            </Badge>
                          </Box>
                        </Flex>
                      </Box>
                      <Divider />
                    </Box>
                  );
                })}
              </>
            )}
          </Flex>
        )}
      </Box>
    </Layout>
  );
}

export default ProjectIssuesPage;
