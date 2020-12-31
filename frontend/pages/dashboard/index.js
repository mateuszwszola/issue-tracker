import { Layout } from '@/components/Layout';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Avatar, Box, Flex, Heading, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { useApiUser } from 'contexts/api-user-context';
import CreateProject from '@/components/dashboard/admin/CreateProject';
import { NextButtonLink } from '@/components/Link';

function Dashboard() {
  const { user } = useApiUser();

  const isAdmin = user?.is_admin;

  return (
    <Layout title="Dashboard">
      <Flex as="nav" justify="space-between">
        {isAdmin && (
          <>
            <NextButtonLink mr={4} href="/dashboard/users">
              Manage users
            </NextButtonLink>

            <CreateProject />
          </>
        )}
      </Flex>

      <Box mt={{ base: 8, md: 16 }}>
        {!user ? (
          <>
            <SkeletonCircle size="12" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" />
          </>
        ) : (
          <Flex justify="space-between" wrap="wrap">
            <Flex wrap="wrap">
              <Avatar size="lg" name={user.name} src={user.picture} />
              <Heading ml={4} size="lg">
                {user.name}
              </Heading>
            </Flex>
          </Flex>
        )}
      </Box>
    </Layout>
  );
}

export default withAuthenticationRequired(Dashboard);
