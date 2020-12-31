import UserRow from '@/components/dashboard/users/UserRow';
import { Layout } from '@/components/Layout';
import { NextButtonLink } from '@/components/Link';
import { FullPageSpinner } from '@/components/Loading';
import PageControls from '@/components/PageControls';
import { tableBorderColor } from '@/components/Table';
import { useWithTokenFetcher } from '@/hooks/use-token-fetcher';
import { useDeleteUser, useWithAdmin } from '@/hooks/use-user';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import {
  Box,
  Flex,
  Heading,
  HStack,
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

  const [onDelete, deleteStatus] = useDeleteUser({
    onSuccess: () => mutate()
  });

  const [pageIndex, setPageIndex] = useState(0);

  const withTokenFetcher = useWithTokenFetcher();

  const { data: usersData, error: usersError, mutate } = useSWR(
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
      <HStack as="nav">
        <NextButtonLink href="/dashboard">Overview</NextButtonLink>
      </HStack>

      <Heading mt={4} size="lg">
        Users
      </Heading>

      <Box mt={{ base: 8 }} w="full" overflow="auto">
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
                      <UserRow
                        key={user.id}
                        user={user}
                        onDelete={() => onDelete(user.id)}
                        deleteStatus={deleteStatus}
                      />
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
    </Layout>
  );
}

export default withAuthenticationRequired(UsersManagement);
