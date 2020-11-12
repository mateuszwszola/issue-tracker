import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { BackButton } from '@/components/BackButton';
import { Box, Heading, Text } from '@chakra-ui/core';

function Project() {
  const router = useRouter();
  const { key } = router.query;

  return (
    <Layout>
      <Box>
        <BackButton>Go back to projects</BackButton>
        <Heading mt={2}>{key}</Heading>
        <Text>TODO: list of tickets</Text>
      </Box>
    </Layout>
  );
}

export default Project;
