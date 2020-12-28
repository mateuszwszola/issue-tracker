import { Layout } from '@/components/Layout';
import ManageProject from '@/components/project/ManageProject';
import { useProject, useProjectEngineers } from '@/hooks/use-project';
import { getProjectIdFromProjectKey } from '@/utils/projects-client';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Skeleton,
  Spinner,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { useApiUser } from 'contexts/api-user-context';
import { format } from 'date-fns';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import AddProjectEngineer from '@/components/project/AddProjectEngineer';

function ProjectPage() {
  const router = useRouter();
  const { key: projectKey } = router.query;
  const projectId = projectKey && getProjectIdFromProjectKey(projectKey);

  const { isLoading: isLoadingProject, project, error: projectError } = useProject(projectId);
  const { isLoading: isLoadingEngineers, engineers, error: engineersError } = useProjectEngineers(
    projectId
  );

  const { user } = useApiUser();
  const isAdmin = user?.is_admin;
  const isProjectManager = user && project && project.manager_id === user.id;

  return (
    <Layout title={`Project ${projectKey}`}>
      {projectError ? (
        <Text textAlign="center">{projectError.message || 'Something went wrong... Sorry'}</Text>
      ) : (
        <Box>
          <Skeleton isLoaded={!isLoadingProject}>
            {isAdmin && <ManageProject projectId={projectId} />}
            <Flex
              mt={{ base: 8, md: 16 }}
              direction={{ base: 'column', md: 'row' }}
              justify={{ md: 'space-between' }}
            >
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
                <NextLink href={`/issues/${encodeURIComponent(String(projectKey))}`} passHref>
                  <Button as="a" variant="outline" colorScheme="blue">
                    Issues
                  </Button>
                </NextLink>
              </Box>
            </Flex>
          </Skeleton>

          <Skeleton isLoaded={!isLoadingProject}>
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
                    <NextLink href={`/user/${encodeURIComponent(project?.createdBy?.id)}`} passHref>
                      <Button ml={1} as="a" variant="link" colorScheme="blue">
                        {project?.createdBy?.name}
                      </Button>
                    </NextLink>
                  </Text>
                  {project?.manager && (
                    <Text display="flex" alignItems="center">
                      Manager
                      <NextLink href={`/user/${encodeURIComponent(project.manager?.id)}`} passHref>
                        <Button ml={1} as="a" variant="link" colorScheme="blue">
                          {project.manager?.name}
                        </Button>
                      </NextLink>
                    </Text>
                  )}
                  {project?.created_at && (
                    <Text>Created at {format(new Date(project.created_at), 'MMM dd, yyyy')}</Text>
                  )}
                </Stack>
              </Box>

              <Box w="full" maxW="400px" mt={{ base: 12, md: 0 }}>
                <Flex align="center" wrap="wrap">
                  <Heading as="h3" size="md">
                    Project engineers:
                  </Heading>
                  {(isAdmin || isProjectManager) && (
                    <AddProjectEngineer ml={3} projectId={projectId} authUserId={user?.id} />
                  )}
                </Flex>

                {engineersError ? (
                  <Text textAlign="center">Unable to load...</Text>
                ) : isLoadingEngineers ? (
                  <Spinner />
                ) : (
                  <Wrap mt={4}>
                    {engineers?.map((engineer) => (
                      <WrapItem key={engineer.id}>
                        <NextLink href={`/user/${encodeURIComponent(engineer.id)}`} passHref>
                          <Avatar as="a" name={engineer.name} src={engineer.picture} />
                        </NextLink>
                      </WrapItem>
                    ))}
                  </Wrap>
                )}
              </Box>
            </Flex>
          </Skeleton>
        </Box>
      )}
    </Layout>
  );
}

export default ProjectPage;
