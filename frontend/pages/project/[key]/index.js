import { BackButton } from '@/components/BackButton';
import { Layout } from '@/components/Layout';
import fetcher from '@/utils/api-client';
import { getProjectIdFromProjectKey } from '@/utils/projects-client';
import { objToQueryString } from '@/utils/query-string';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Heading,
  Skeleton,
  Tag,
  Text
} from '@chakra-ui/react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const queryString = objToQueryString({
  withGraph: '[type, createdBy, manager, engineers]'
});

function ProjectPage() {
  const router = useRouter();
  const { key: projectKey } = router.query;
  const projectId = projectKey && getProjectIdFromProjectKey(projectKey);
  const { data, error } = useSWR(
    projectId ? `projects/${projectId}?${queryString}` : null,
    fetcher
  );

  const project = data?.project || null;

  return (
    <Layout>
      <Box>
        <BackButton disabled={!error && !data}>Go back</BackButton>
        {error ? (
          <Text textAlign="center">Something went wrong... Please try reload the page</Text>
        ) : !project ? (
          <>
            <Skeleton height="50px" />
          </>
        ) : (
          <Box mt={8}>
            <Flex direction={['column', 'row']}>
              <Box flex={['100%', '50%']} pr={{ base: 2 }}>
                <Heading as="h2" display="flex" flexWrap="wrap" alignItems="center" size="lg">
                  <Text as="span" mr={3}>
                    Project: {project.name}
                  </Text>
                  {project.type?.name && <Tag>{project.type.name}</Tag>}
                </Heading>
                {project.description && <Text mt={2}>{project.description}</Text>}
              </Box>
              <Box width={['100%', '50%']} mt={[4, 0]} px={1}>
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
                  <Link href={`/users/${encodeURIComponent(project.createdBy?.sub)}`} passHref>
                    <Button ml={1} as="a" variant="link" colorScheme="blue">
                      {project.createdBy?.name}
                    </Button>
                  </Link>
                </Text>
                {project.manager && (
                  <Text mt={4} display="flex" alignItems="center">
                    Manager
                    <Link href={`/users/${encodeURIComponent(project.manager?.sub)}`} passHref>
                      <Button ml={1} as="a" variant="link" colorScheme="blue">
                        {project.manager?.name}
                      </Button>
                    </Link>
                  </Text>
                )}
                {project.created_at && (
                  <Text mt={4}>
                    Created at {format(new Date(project.created_at), 'MMM M, yyyy')}
                  </Text>
                )}
              </Box>
              <Box width={['100%', '50%']} mt={[12, 0]}>
                <Heading as="h3" size="md">
                  Project engineers:
                </Heading>
                <AvatarGroup mt={2} size="md" max={3}>
                  {project.engineers?.map((engineer) => (
                    <Avatar key={engineer.id} name={engineer.name} src={engineer.picture} />
                  ))}
                </AvatarGroup>
              </Box>
            </Flex>
          </Box>
        )}
      </Box>
    </Layout>
  );
}

export default ProjectPage;
