import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { Box, Heading, Button } from '@chakra-ui/react';
import Link from 'next/link';

function ProjectPage() {
  const router = useRouter();
  const { key } = router.query;

  return (
    <Layout>
      <Box>
        <Heading mt={2}>Project key: {key}</Heading>
        <Box mt={2}>
          <Link href={`/issues/${encodeURIComponent(key)}`} passHref>
            <Button as="a" variant="link" colorScheme="blue">
              Issues
            </Button>
          </Link>
        </Box>
      </Box>
    </Layout>
  );
}

export default ProjectPage;
