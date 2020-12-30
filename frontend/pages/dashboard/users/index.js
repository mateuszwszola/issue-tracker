import UserRow from '@/components/dashboard/users/UserRow';
import { Layout } from '@/components/Layout';
import { NextButtonLink } from '@/components/Link';
import { FullPageSpinner } from '@/components/Loading';
import PageControls from '@/components/PageControls';
import { useWithTokenFetcher } from '@/hooks/use-token-fetcher';
import { useDeleteUser, useWithAdmin } from '@/hooks/use-user';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import {
  Box,
  Flex,
  Heading,
  HStack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorMode
} from '@chakra-ui/react';
import { useState } from 'react';
import useSWR from 'swr';

const borderColor = { light: 'gray.200', dark: 'gray.700' };

const PAGE_SIZE = 10;

function UsersManagement() {
  const { isLoading: isLoadingPage } = useWithAdmin('/dashboard');

  const { colorMode } = useColorMode();

  const [onDelete] = useDeleteUser({
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

      <Box mt={{ base: 8 }}>
        <Table border="2px" borderColor="transparent" size="sm" variant="striped">
          <Heading
            as={TableCaption}
            placement="top"
            mt={2}
            mb={6}
            size="md"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            Users
          </Heading>

          <Thead borderBottom="2px" borderColor={borderColor[colorMode]}>
            <Tr>
              <Th>ID</Th>
              <Th>Email</Th>
              <Th>Name</Th>
              <Th>Created at</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {usersError ? (
              <Tr>
                <Td textAlign="center" colSpan={5}>
                  Unable to fetch users
                </Td>
              </Tr>
            ) : !users ? (
              <Tr>
                <Td textAlign="center" colSpan={5}>
                  Loading...
                </Td>
              </Tr>
            ) : (
              <>
                {!users.length ? (
                  <Tr>
                    <Td textAlign="center" colSpan={5}>
                      No users found
                    </Td>
                  </Tr>
                ) : (
                  <>
                    {users.map((user) => (
                      <UserRow key={user.id} user={user} onDelete={() => onDelete(user.id)} />
                    ))}
                  </>
                )}
              </>
            )}
          </Tbody>

          <Tfoot borderTop="2px" borderColor={borderColor[colorMode]}>
            <Tr>
              <Td colSpan="5">
                <Text fontSize="sm" textAlign="right" color="gray.500" fontWeight="medium">
                  Showing {isLoadingUsers ? '...' : users?.length || 0} users
                </Text>
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      </Box>

      {users && (
        <Flex mt={2} w="full" justify="center">
          <PageControls
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            pageData={users}
            PAGE_SIZE={PAGE_SIZE}
          />
        </Flex>
      )}
    </Layout>
  );
}

export default withAuthenticationRequired(UsersManagement);
