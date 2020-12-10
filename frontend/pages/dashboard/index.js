import {
  Flex,
  Heading,
  Text,
  Box,
  SkeletonCircle,
  SkeletonText,
  Avatar,
  Button
} from '@chakra-ui/react';
import { Layout } from '@/components/Layout';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useApiUser } from 'contexts/api-user-context';
import { FaPlus } from 'react-icons/fa';
import { useCreateProjectModal } from '@/components/dashboard/CreateProject';

function Dashboard() {
  const { error } = useAuth0();
  const { user } = useApiUser();
  const {
    createProjectModal: CreateProjectModal,
    onOpen: openCreateProjectModal
  } = useCreateProjectModal();

  return (
    <Layout title="Dashboard">
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
            <Flex justify="space-between">
              <Flex>
                <Avatar size="lg" name={user.name} src={user.picture} />
                <Heading ml={4} as="h2" fontSize="3xl" fontWeight="semibold">
                  {user.name}
                </Heading>
              </Flex>
              <Button leftIcon={<FaPlus />} onClick={openCreateProjectModal}>
                Create project
              </Button>

              <CreateProjectModal />
            </Flex>
          </>
        )}
      </Box>
    </Layout>
  );
}

export default withAuthenticationRequired(Dashboard);
