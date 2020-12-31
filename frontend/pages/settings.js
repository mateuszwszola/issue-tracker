import { Layout } from '@/components/Layout';
import DeleteAccount from '@/components/settings/DeleteAccount';
import UpdateProfileForm from '@/components/settings/UpdateProfileForm';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { useApiUser } from 'contexts/api-user-context';

function Settings() {
  const { user } = useApiUser();

  return (
    <Layout title="Settings">
      <Flex w="full" justify="space-between" align="center" wrap="wrap">
        <Heading size="lg">Settings</Heading>

        <DeleteAccount />
      </Flex>

      <Box mt={{ base: 8, md: 16 }}>
        <Box w="full" maxWidth="500px" mx="auto">
          <Heading size="md" textAlign="center">
            Update profile info
          </Heading>
          <UpdateProfileForm name={user.name} />
        </Box>
      </Box>
    </Layout>
  );
}

export default withAuthenticationRequired(Settings);
