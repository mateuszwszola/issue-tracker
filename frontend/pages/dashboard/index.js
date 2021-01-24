import NextLink from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import { useApiUser } from 'contexts/api-user-context';
import CreateProject from '@/components/dashboard/admin/CreateProject';
import DashboardNav from '@/components/dashboard/Nav';
import { Layout } from '@/components/Layout';
import { useWithTokenFetcher } from '@/hooks/use-token-fetcher';
import PageControls from '@/components/PageControls';

function Dashboard() {
  const { user } = useApiUser();
  const isAdmin = user?.is_admin;
  const [pageIndex, setPageIndex] = useState(0);
  const withTokenFetcher = useWithTokenFetcher();
  const { data, error } = useSWR(
    `projects/dashboard?withGraph=${encodeURIComponent(
      '[createdBy,manager]'
    )}&page=${pageIndex}&limit=10`,
    withTokenFetcher
  );

  const projects = data?.projects;

  return (
    <Layout title="Dashboard">
      <DashboardNav isAdmin={isAdmin} />

      <Box mt={8}>
        <Flex justify="space-between">
          <Heading size="lg">My Projects</Heading>
          {isAdmin && <CreateProject />}
        </Flex>

        <Box mt={6} overflow="auto" w="full">
          {error ? (
            <Text>Unable to fetch projects</Text>
          ) : !projects ? (
            <Text>Loading...</Text>
          ) : (
            <>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Key</Th>
                    <Th>Lead</Th>
                    <Th>Created By</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {projects.map((project) => (
                    <Tr key={project.id}>
                      <Td>
                        <NextLink href={`/project/${project.key}`} passHref>
                          <Button as="a" variant="link">
                            {project.name}
                          </Button>
                        </NextLink>
                      </Td>
                      <Td>{project.key}</Td>
                      <Td>{project.manager?.name}</Td>
                      <Td>{project.createdBy?.name}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Flex mt={4} w="full" justify="center">
                <PageControls
                  pageIndex={pageIndex}
                  setPageIndex={setPageIndex}
                  pageData={projects}
                  PAGE_SIZE={10}
                />
              </Flex>
            </>
          )}
        </Box>
      </Box>
    </Layout>
  );
}

export default withAuthenticationRequired(Dashboard);
