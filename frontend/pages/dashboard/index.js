import { BackButton } from '@/components/BackButton';
import CreateProject, { CreateProjectModal } from '@/components/dashboard/CreateProject';
import { Layout } from '@/components/Layout';
import { useUser } from '@/hooks/use-user';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  SkeletonCircle,
  SkeletonText,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

function AdminDashboard({ user }) {
  const {
    isOpen: isCreateProjectModalOpen,
    onOpen: openCreateProjectModal,
    onClose: closeCreateProjectModal
  } = useDisclosure();

  return (
    <Flex justify="space-between" wrap="wrap">
      <Flex wrap="wrap">
        <Avatar size="lg" name={user.name} src={user.picture} />
        <Heading ml={4} as="h2" fontSize="3xl" fontWeight="semibold">
          {user.name}
        </Heading>
      </Flex>

      <Button
        my={1}
        size="sm"
        colorScheme="blue"
        leftIcon={<FaPlus />}
        onClick={openCreateProjectModal}
      >
        Create project
      </Button>

      <CreateProjectModal isOpen={isCreateProjectModalOpen} onClose={closeCreateProjectModal}>
        <CreateProject onClose={closeCreateProjectModal} />
      </CreateProjectModal>
    </Flex>
  );
}

AdminDashboard.propTypes = {
  user: PropTypes.object.isRequired
};

function Dashboard() {
  const { user, loading, error } = useUser();

  const isAdmin = user?.is_admin;

  return (
    <Layout title="Dashboard">
      <Box>
        <BackButton>Go back</BackButton>
      </Box>
      <Box mt={{ base: 8, md: 16 }}>
        {error ? (
          <Text textAlign="center">Something went wrong... Sorry</Text>
        ) : loading ? (
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
