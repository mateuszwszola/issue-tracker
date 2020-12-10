import { BackButton } from '@/components/BackButton';
import { useCreateProjectModal } from '@/components/dashboard/CreateProject';
import { Layout } from '@/components/Layout';
import { useIsAdmin } from '@/hooks/use-is-admin';
import { useSWRWithToken } from '@/hooks/use-swr-w-token';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  SkeletonCircle,
  SkeletonText,
  Text
} from '@chakra-ui/react';
import { useApiUser } from 'contexts/api-user-context';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

function AdminDashboard({ user }) {
  const { data, error } = useSWRWithToken('users');
  const {
    createProjectModal: CreateProjectModal,
    onOpen: openCreateProjectModal
  } = useCreateProjectModal();

  const users = data?.users || null;
  const isLoading = !error && !users;

  if (isLoading) {
    return <Box>Loading users...</Box>;
  }

  return (
    <Flex justify="space-between" wrap="wrap">
      <Flex wrap="wrap">
        <Avatar size="lg" name={user.name} src={user.picture} />
        <Heading ml={4} as="h2" fontSize="3xl" fontWeight="semibold">
          {user.name}
        </Heading>
      </Flex>
      <Button size="sm" colorScheme="blue" leftIcon={<FaPlus />} onClick={openCreateProjectModal}>
        Create project
      </Button>
      <CreateProjectModal />
    </Flex>
  );
}

AdminDashboard.propTypes = {
  user: PropTypes.object.isRequired
};

function Dashboard() {
  const { error } = useAuth0();
  const { user } = useApiUser();
  const { isAdmin } = useIsAdmin();

  return (
    <Layout title="Dashboard">
      <Box>
        <BackButton>Go back</BackButton>
      </Box>
      <Box mt={{ base: 8, md: 16 }}>
        {error ? (
          <Text textAlign="center">Something went wrong... Sorry</Text>
        ) : !user ? (
          <>
            <SkeletonCircle size="12" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" />
          </>
        ) : (
          <>
            {isAdmin ? (
              <AdminDashboard user={user} />
            ) : (
              <Flex justify="space-between" wrap="wrap">
                <Flex wrap="wrap">
                  <Avatar size="lg" name={user.name} src={user.picture} />
                  <Heading ml={4} as="h2" fontSize="3xl" fontWeight="semibold">
                    {user.name}
                  </Heading>
                </Flex>
              </Flex>
            )}
          </>
        )}
      </Box>
    </Layout>
  );
}

export default withAuthenticationRequired(Dashboard);
