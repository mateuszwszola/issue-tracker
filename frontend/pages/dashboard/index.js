import { Layout } from '@/components/Layout';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Avatar, Box, Flex, Heading, HStack, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { useApiUser } from 'contexts/api-user-context';
import CreateProject from '@/components/dashboard/admin/CreateProject';
import { NextButtonLink } from '@/components/Link';

function Dashboard() {
  const { user } = useApiUser();

  const isAdmin = user?.is_admin;

  return (
    <Layout title="Dashboard">
      <HStack as="nav">
        {isAdmin && <NextButtonLink href="/dashboard/users">Users</NextButtonLink>}
      </HStack>

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

              {isAdmin && <CreateProject />}
            </Flex>
          </Box>
        )}
      </Box>
    </Layout>
  );
}

export default withAuthenticationRequired(Dashboard);
