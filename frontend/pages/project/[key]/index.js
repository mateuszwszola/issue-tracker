import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import { format } from 'date-fns';
import {
  Box,
  Heading,
  Button,
  Text,
  Skeleton,
  Tag,
  Flex,
  Wrap,
  WrapItem,
  Avatar
} from '@chakra-ui/react';
import { Layout } from '@/components/Layout';
import { getProjectIdFromProjectKey } from '@/utils/projects-client';
import { objToQueryString } from '@/utils/query-string';
import fetcher from '@/utils/api-client';

function ProjectPage() {
  const router = useRouter();
  const { key: projectKey } = router.query;
  const projectId = projectKey && getProjectIdFromProjectKey(projectKey);
  const queryString = objToQueryString({
    withGraph: '[type, createdBy, manager, engineers]'
  });
  const { data, error } = useSWR(
    projectId ? `projects/${projectId}?${queryString}` : null,
    fetcher
  );

  return (
    <Layout>
      <Box mt={8}>
        {error ? (
          <Text textAlign="center" mt={4}>
            Something went wrong... Please try reload the page
          </Text>
        ) : (
          <Skeleton isLoaded={!!data}>
            <Flex direction={['column', 'row']}>
              <Box width={['100%', '50%']}>
                <Heading as="h2" display="flex" alignItems="center" size="lg">
                  {data?.project?.name}
                  <Tag ml={3}>{data?.project?.type?.name}</Tag>
                </Heading>
                {data?.project?.description && <Text mt={2}>{data.project.description}</Text>}
              </Box>
              <Box width={['100%', '50%']} mt={[4, 0]}>
                <Link href={`/issues/${encodeURIComponent(projectKey)}`} passHref>
                  <Button as="a" variant="outline" colorScheme="blue">
                    Issues
                  </Button>
                </Link>
              </Box>
            </Flex>

            <Flex mt={12} direction={['column', 'row']}>
              <Box width={['100%', '50%']}>
                <Heading as="h3" size="md">
                  About
                </Heading>
                <Text mt={4} display="flex" alignItems="center">
                  Created by
                  <Link
                    href={`/users/${encodeURIComponent(data?.project?.createdBy?.sub)}`}
                    passHref
                  >
                    <Button ml={1} as="a" variant="link" colorScheme="blue">
                      {data?.project?.createdBy?.name}
                    </Button>
                  </Link>
                </Text>
                {data?.project?.manager && (
                  <Text mt={4} display="flex" alignItems="center">
                    Manager
                    <Link href={`/users/${encodeURIComponent(data.project.manager.sub)}`} passHref>
                      <Button ml={1} as="a" variant="link" colorScheme="blue">
                        {data.project.manager.name}
                      </Button>
                    </Link>
                  </Text>
                )}
                {data?.project?.created_at && (
                  <Text mt={4}>
                    Created at {format(new Date(data.project.created_at), 'MMM M, yyyy')}
                  </Text>
                )}
              </Box>
              <Box width={['100%', '50%']} mt={[12, 0]}>
                <Wrap>
                  <Heading as="h3" size="md">
                    Project engineers:
                  </Heading>
                  {data?.project?.engineers?.map((engineer) => (
                    <WrapItem key={engineer.id}>
                      <Avatar name={engineer.name} src={engineer.picture} />
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            </Flex>
          </Skeleton>
        )}
      </Box>
    </Layout>
  );
}

export default ProjectPage;
