import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { NextButtonLink } from '@/components/Link';
import { FullPageSpinner } from '@/components/Loading';
import { useWithAdmin } from '@/hooks/use-user';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { FaEllipsisV } from 'react-icons/fa';
import useSWR from 'swr';
import { useWithTokenFetcher } from '@/hooks/use-token-fetcher';

function ActionsMenu() {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<FaEllipsisV />}
        bgColor="transparent"
      />
      <MenuList>
        <MenuItem>Block</MenuItem>
        <MenuItem>Delete</MenuItem>
      </MenuList>
    </Menu>
  );
}

function UsersManagement() {
  const { isLoading } = useWithAdmin('/dashboard');

  const [pageIndex, setPageIndex] = useState(0);

  const withTokenFetcher = useWithTokenFetcher();

  const { data: usersData, error: usersError } = useSWR(
    `users?page=${pageIndex}&limit=10`,
    withTokenFetcher
  );

  const users = usersData?.users;

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <Layout title="User management">
      <Box mt={{ base: 8 }}>
        <NextButtonLink display="block" href="/dashboard">
          Dashboard
        </NextButtonLink>

        <Box mt={8} overflowX="auto">
          <Table variant="simple">
            <TableCaption>Users</TableCaption>
            <Thead>
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
                        <Tr key={user.id}>
                          <Td>{user.id}</Td>
                          <Td>{user.email}</Td>
                          <Td>{user.name}</Td>
                          <Td>{format(new Date(user.created_at), 'dd MMM, yyyy')}</Td>
                          <Td>
                            <ActionsMenu />
                          </Td>
                        </Tr>
                      ))}
                    </>
                  )}
                </>
              )}
            </Tbody>
          </Table>
          {users && (
            <Flex p={1} w="full">
              <ButtonGroup as={Flex} size="sm" variant="outline" align="center">
                <Button
                  disabled={pageIndex <= 0}
                  onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                >
                  Prev
                </Button>
                <Text mx={1}>{pageIndex}</Text>
                <Button disabled={!users.length} onClick={() => setPageIndex((p) => p + 1)}>
                  Next
                </Button>
              </ButtonGroup>
            </Flex>
          )}
        </Box>
      </Box>
    </Layout>
  );
}

export default withAuthenticationRequired(UsersManagement);
