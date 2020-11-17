import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { BackButton } from '@/components/BackButton';
import { Box, Heading } from '@chakra-ui/core';
import Link from 'next/link';

function Project() {
  const router = useRouter();
  const { key } = router.query;

  return (
    <Layout>
      <Box>
        <BackButton>Go back to projects</BackButton>
        <Heading mt={2}>{key}</Heading>
        <Link href={`/projects/${encodeURIComponent(key)}/backlog`}>
          <a>Backlog</a>
        </Link>
      </Box>
    </Layout>
  );
}

export default Project;
