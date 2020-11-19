import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Layout } from '@/components/Layout';
import { BackButton } from '@/components/BackButton';
import {
  Box,
  Flex,
  Heading,
  Divider,
  Text,
  SimpleGrid,
  Skeleton,
  Stack,
  Link,
  Button,
  Badge
} from '@chakra-ui/react';
import useSWR from 'swr';
import { getProjectTickets } from 'utils/tickets-client';
import { InputSearch } from '@/components/InputSearch';
import { FilterMenu } from '@/components/issues/FilterMenu';
import React from 'react';

function ProjectIssuesPage() {
  const router = useRouter();
  const { projectKey } = router.query;
  const { data, error } = useSWR(projectKey ? ['tickets', projectKey] : null, () =>
    getProjectTickets(projectKey)
  );

  return (
    <Layout>
      <Box>
        <BackButton>Go back</BackButton>
        <Heading as="h2" fontSize="xl" mt={2}>
          Issues for project: {projectKey}
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
        ) : !data ? (
          <Stack>
            {Array(5)
              .fill(null)
              .map((_, idx) => (
                <Skeleton key={idx} height="40px" />
              ))}
          </Stack>
        ) : (
          <Flex direction="column" align="stretch" overflowX="auto">
            {data.tickets?.map((ticket) => (
              <Box key={ticket.id}>
                <Box py={2}>
                  <Flex align="center">
                    <NextLink href={`/issue/${encodeURIComponent(ticket.key)}`} passHref>
                      <Link fontSize="sm">{ticket.key}</Link>
                    </NextLink>
                    <NextLink href={`/issue/${encodeURIComponent(ticket.key)}`} passHref>
                      <Button as="a" ml={3} colorScheme="blue" size="sm" variant="link">
                        {ticket.name}
                      </Button>
                    </NextLink>
                  </Flex>
                  <Flex mt={2}>
                    <Box flex={1}>
                      <Badge fontSize="xs" colorScheme="red">
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
            ))}
          </Flex>
        )}
      </Box>
    </Layout>
  );
}

export default ProjectIssuesPage;
