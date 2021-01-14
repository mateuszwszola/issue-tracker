import { Layout } from '@/components/Layout';
import { NextButtonLink } from '@/components/Link';
import fetcher from '@/utils/api-client';
import { objToQueryString } from '@/utils/query-string';
import {
  Avatar,
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const queryString = objToQueryString({
  withGraph: '[managedProjects, engineeredProjects]'
});

function UserPage() {
  const router = useRouter();
  const { userId } = router.query;
  const { data, error } = useSWR(userId ? `profiles/${userId}?${queryString}` : null, fetcher);

  const profile = data?.profile;
  const isLoading = !error && !profile;

  return (
    <Layout title={`User ${userId}`}>
      <Box my={{ base: 8, md: 16 }}>
        {error ? (
          <Text textAlign="center">Something went wrong... Sorry</Text>
        ) : (
          <>
            {isLoading ? (
              <>
                <SkeletonCircle size="12" />
                <SkeletonText mt="4" noOfLines={4} spacing="4" />
              </>
            ) : (
              <>
                <Flex>
                  <Avatar size="lg" name={profile.name} src={profile.picture} />
                  <Box ml={4}>
                    <Heading size="lg" fontWeight="semibold">
                      {profile.name}
                    </Heading>
                  </Box>
                </Flex>

                <Flex mt={16} direction={{ base: 'column', md: 'row' }}>
                  <Box flex={1}>
                    <Skeleton isLoaded={!isLoading}>
                      <Heading as="h3" fontSize="xl">
                        Project manager
                      </Heading>
                      <Box mt={4}>
                        {profile?.managedProjects?.length > 0 ? (
                          <List spacing={2}>
                            {profile.managedProjects.map((project) => (
                              <ListItem key={project.key}>
                                <NextButtonLink href={`/project/${project.key}`}>
                                  {project.name}
                                </NextButtonLink>
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Text>None</Text>
                        )}
                      </Box>
                    </Skeleton>
                  </Box>

                  <Box flex={1} mt={{ base: 12, md: 0 }}>
                    <Skeleton isLoaded={!isLoading}>
                      <Heading as="h3" fontSize="xl">
                        Project engineer
                      </Heading>
                      <Box mt={4}>
                        {profile?.engineeredProjects?.length > 0 ? (
                          <List spacing={3}>
                            {profile.engineeredProjects.map((project) => (
                              <ListItem key={project.key}>
                                <NextButtonLink href={`/project/${project.key}`}>
                                  {project.name}
                                </NextButtonLink>
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Text>None</Text>
                        )}
                      </Box>
                    </Skeleton>
                  </Box>
                </Flex>
              </>
            )}
          </>
        )}
      </Box>
    </Layout>
  );
}

export default UserPage;
