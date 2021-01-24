import DashboardNav from '@/components/dashboard/Nav';
import UserRow from '@/components/dashboard/users/UserRow';
import { Layout } from '@/components/Layout';
import { FullPageSpinner } from '@/components/Loading';
import PageControls from '@/components/PageControls';
import { tableBorderColor } from '@/components/Table';
import { useWithTokenFetcher } from '@/hooks/use-token-fetcher';
import { useWithAdmin } from '@/hooks/use-user';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import {
  Box,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode
} from '@chakra-ui/react';
import { useState } from 'react';
import useSWR from 'swr';

const PAGE_SIZE = 10;

function UsersManagement() {
  const { isLoading: isLoadingPage } = useWithAdmin('/dashboard');
  const { colorMode } = useColorMode();
  const [pageIndex, setPageIndex] = useState(0);
  const withTokenFetcher = useWithTokenFetcher();
  const { data: usersData, error: usersError } = useSWR(
    `users?page=${pageIndex}&limit=${PAGE_SIZE}`,
    withTokenFetcher
  );

  const isLoadingUsers = !usersData && !usersError;
  const users = usersData?.users;

  if (isLoadingPage) {
    return <FullPageSpinner />;
  }

  return (
    <Layout title="User management">
      <DashboardNav isAdmin />

      <Box mt={{ base: 8, md: 16 }}>
        <Heading size="lg">Users</Heading>

        <Box mt={4} w="full" overflow="auto">
          <Table border="2px" borderColor="transparent" size="sm" variant="striped">
            <Thead borderBottom="2px" borderColor={tableBorderColor[colorMode]}>
              <Tr>
                <Th>ID</Th>
                <Th>Email</Th>
                <Th>Name</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {usersError ? (
                <Tr>
                  <Td textAlign="center" colSpan={4}>
                    Unable to fetch users
                  </Td>
                </Tr>
              ) : !users ? (
                <Tr>
                  <Td textAlign="center" colSpan={4}>
                    Loading...
                  </Td>
                </Tr>
              ) : (
                <>
                  {!users.length ? (
                    <Tr>
                      <Td textAlign="center" colSpan={4}>
                        No users found
                      </Td>
                    </Tr>
                  ) : (
                    <>
                      {users.map((user) => (
                        <UserRow key={user.id} user={user} />
                      ))}
                    </>
                  )}
                </>
              )}
            </Tbody>
          </Table>
        </Box>

        {users && (
          <>
            <Text p={1} fontSize="sm" textAlign="right" color="gray.500" fontWeight="medium">
              Showing {isLoadingUsers ? '...' : users?.length || 0} users
            </Text>
            <Flex mt={2} w="full" justify="center">
              <PageControls
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                pageData={users}
                PAGE_SIZE={PAGE_SIZE}
              />
            </Flex>
          </>
        )}
      </Box>
    </Layout>
  );
}

export default withAuthenticationRequired(UsersManagement);
