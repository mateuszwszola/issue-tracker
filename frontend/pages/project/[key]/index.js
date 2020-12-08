import { BackButton } from '@/components/BackButton';
import { Layout } from '@/components/Layout';
import fetcher from '@/utils/api-client';
import { getProjectIdFromProjectKey } from '@/utils/projects-client';
import { objToQueryString } from '@/utils/query-string';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { format } from 'date-fns';
import NextLink from 'next/link';
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

  const project = data?.project;
  const isLoading = !error && !project;

  return (
    <Layout>
      <Box>
        <BackButton disabled={isLoading}>Go back</BackButton>
      </Box>
      <Box mt={{ base: 8, md: 16 }}>
        {error ? (
          <Text textAlign="center">Something went wrong... Sorry</Text>
        ) : (
          <>
            <Skeleton isLoaded={!isLoading}>
              <Flex direction={{ base: 'column', md: 'row' }} justify={{ md: 'space-between' }}>
                <Box w="full" maxW="640px" pr={{ md: 8 }}>
                  <Heading as="h2" display="flex" flexWrap="wrap" alignItems="center" size="lg">
                    <Text as="span" mr={3}>
                      Project: {project?.name}
                    </Text>
                    {project?.type?.name && <Tag my={1}>{project.type.name}</Tag>}
                  </Heading>
                  {project?.description && <Text mt={2}>{project.description}</Text>}
                </Box>
                <Box w="full" maxW="400px" mt={{ base: 4, md: 0 }}>
                  <NextLink href={`/issues/${encodeURIComponent(projectKey)}`} passHref>
                    <Button as="a" variant="outline" colorScheme="blue">
                      Issues
                    </Button>
                  </NextLink>
                </Box>
              </Flex>
            </Skeleton>

            <Skeleton isLoaded={!isLoading}>
              <Flex
                mt={12}
                direction={{ base: 'column', md: 'row' }}
                justify={{ md: 'space-between' }}
              >
                <Box w="full" maxW="640px">
                  <Heading as="h3" size="md">
                    About
                  </Heading>

                  <Stack mt={4} spacing={3}>
                    <Text display="flex" alignItems="center">
                      Created by
                      <NextLink
                        href={`/user/${encodeURIComponent(project?.createdBy?.id)}`}
                        passHref
                      >
                        <Button ml={1} as="a" variant="link" colorScheme="blue">
                          {project?.createdBy?.name}
                        </Button>
                      </NextLink>
                    </Text>
                    {project?.manager && (
                      <Text display="flex" alignItems="center">
                        Manager
                        <NextLink
                          href={`/user/${encodeURIComponent(project.manager?.id)}`}
                          passHref
                        >
                          <Button ml={1} as="a" variant="link" colorScheme="blue">
                            {project.manager?.name}
                          </Button>
                        </NextLink>
                      </Text>
                    )}
                    {project?.created_at && (
                      <Text>Created at {format(new Date(project.created_at), 'MMM M, yyyy')}</Text>
                    )}
                  </Stack>
                </Box>

                <Box w="full" maxW="400px" mt={{ base: 12, md: 0 }}>
                  <Heading as="h3" size="md">
                    Project engineers:
                  </Heading>
                  <Wrap mt={4}>
                    {project?.engineers?.map((engineer) => (
                      <WrapItem key={engineer.id}>
                        <NextLink href={`/user/${encodeURIComponent(engineer.id)}`} passHref>
                          <Avatar as="a" name={engineer.name} src={engineer.picture} />
                        </NextLink>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
              </Flex>
            </Skeleton>
          </>
        )}
      </Box>
    </Layout>
  );
}

export default ProjectPage;
