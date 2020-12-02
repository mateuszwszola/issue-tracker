import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { BackButton } from '@/components/BackButton';
import { Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { InputSearch } from '@/components/InputSearch';
import { objToQueryString } from '@/utils/query-string';
import { FilterMenu } from '@/components/issues/FilterMenu';
import { getProjectIdFromProjectKey } from '@/utils/projects-client';
import fetcher from '@/utils/api-client';
import { useInfiniteScroll } from '../../../hooks/use-infinite-scroll';
import { Issues } from '@/components/issues/Issues';
import { useDebouncedSearchKey } from '../../../hooks/use-search';

const PAGE_SIZE = 10;

function ProjectIssuesPage() {
  const router = useRouter();
  const { projectKey } = router.query;
  const projectId = projectKey && getProjectIdFromProjectKey(projectKey);
  const { inputValue, handleInputValueChange, searchKey } = useDebouncedSearchKey('');

  const getKey = useCallback(
    (pageIndex) => {
      const queryString = objToQueryString({
        page: pageIndex,
        limit: PAGE_SIZE,
        projectId,
        search: searchKey,
        withGraph: '[type, status, priority, assignee, createdBy, updatedBy, comments]'
      });

      return projectId ? `tickets?${queryString}` : null;
    },
    [projectId, searchKey]
  );

  const {
    error,
    results: tickets,
    isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    isRefreshing,
    isEmpty,
    size,
    fetchMore
  } = useInfiniteScroll(getKey, fetcher, 'tickets', PAGE_SIZE);

  return (
    <Layout>
      <Box>
        <BackButton>Go back</BackButton>
        <Heading as="h2" fontSize="xl" mt={6}>
          Issues for: {projectKey}
        </Heading>
      </Box>

      <Flex mt={4} direction={['column', null, 'row']} align={{ sm: 'center' }}>
        <Box w="full" maxW={['100%', 'xs']}>
          <InputSearch value={inputValue} handleChange={handleInputValueChange} />
        </Box>

        <SimpleGrid mt={{ base: 2, md: 0 }} ml={{ md: 4 }} columns={[2, 4]} spacing={1}>
          <Box>
            <FilterMenu label="Type" options={['Task', 'Bug', 'Feature Request']} />
          </Box>
          <Box>
            <FilterMenu label="State" options={['To Do', 'In Progress', 'Done']} />
          </Box>
          <Box>
            <FilterMenu label="Priority" options={['P1', 'P2', 'P3', 'P4', 'P5']} />
          </Box>
          <Box>
            <FilterMenu label="Assignee" options={['User #1', 'User #2']} />
          </Box>
        </SimpleGrid>
      </Flex>

      <Box my={12}>
        {error ? (
          <Text>Something went wrong... Try reload the page</Text>
        ) : (
          <Issues
            tickets={tickets}
            isLoadingInitialData={isLoadingInitialData}
            isLoadingMore={isLoadingMore}
            isReachingEnd={isReachingEnd}
            isRefreshing={isRefreshing}
            fetchMore={fetchMore}
            isEmpty={isEmpty}
            size={size}
          />
        )}
      </Box>
    </Layout>
  );
}

export default ProjectIssuesPage;
