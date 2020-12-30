import { Layout } from '@/components/Layout';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Avatar, Box, Flex, Heading, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { useApiUser } from 'contexts/api-user-context';
import CreateProject from '@/components/dashboard/admin/CreateProject';
import NextLink from 'next/link';

function Dashboard() {
  const { user } = useApiUser();

  const isAdmin = user?.is_admin;

  return (
    <Layout title="Dashboard">
      <Box mt={{ base: 8 }}>
        {!user ? (
          <>
            <SkeletonCircle size="12" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" />
          </>
        ) : (
          <Box>
            <Flex justify="space-between" wrap="wrap">
              <Flex wrap="wrap">
                <Avatar size="lg" name={user.name} src={user.picture} />
                <Heading ml={4} as="h2" fontSize="3xl" fontWeight="semibold">
                  {user.name}
                </Heading>
              </Flex>

              {isAdmin && (
                <>
                  <CreateProject />
                  <NextLink href="/dashboard/users">
                    <a>Users</a>
                  </NextLink>
                </>
              )}
            </Flex>
          </Box>
        )}
      </Box>
    </Layout>
  );
}

export default withAuthenticationRequired(Dashboard);
