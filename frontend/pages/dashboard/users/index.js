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
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  Table,
  Th,
  Tr,
  Td,
  Thead,
  Tbody,
  Tfoot,
  TableCaption
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { FaArrowLeft, FaArrowRight, FaEllipsisV } from 'react-icons/fa';
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

const borderColor = { light: 'gray.200', dark: 'gray.700' };
const hoverColor = { light: 'gray.100', dark: 'gray.700' };
const rowBgColor = { light: 'gray.50', dark: 'gray.900' };

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
      <HStack as="nav">
        <NextButtonLink href="/dashboard">Overview</NextButtonLink>
      </HStack>

      <Box mt={{ base: 8 }}>
        <Table border="2px" borderColor="transparent" size="sm">
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
                    {users.map((user, idx) => (
                      <Tr
                        _hover={{ background: hoverColor[colorMode] }}
                        bgColor={idx % 2 === 0 ? 'transparent' : rowBgColor[colorMode]}
                        key={user.id}
                      >
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
          <ButtonGroup as={Flex} size="sm" variant="outline" align="center">
            <Button
              leftIcon={<FaArrowLeft />}
              disabled={pageIndex <= 0}
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            >
              Prev
            </Button>
            <Text mx={1}>{pageIndex}</Text>
            <Button
              rightIcon={<FaArrowRight />}
              disabled={!users.length || users.length < PAGE_SIZE}
              onClick={() => setPageIndex((p) => p + 1)}
            >
              Next
            </Button>
          </ButtonGroup>
        </Flex>
      )}
    </Layout>
  );
}

export default withAuthenticationRequired(UsersManagement);
