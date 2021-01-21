import CreateProject from '@/components/dashboard/admin/CreateProject';
import DashboardNav from '@/components/dashboard/Nav';
import { Layout } from '@/components/Layout';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Avatar, Box, Flex, Heading, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { useApiUser } from 'contexts/api-user-context';

function Dashboard() {
  const { user } = useApiUser();
  const isAdmin = user?.is_admin;

  return (
    <Layout title="Dashboard">
      <DashboardNav isAdmin={isAdmin} />

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

            {isAdmin && <CreateProject />}
          </Flex>
        )}
      </Box>
    </Layout>
  );
}

export default withAuthenticationRequired(Dashboard);
