import { useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { InputSearch } from '@/components/InputSearch';
import { objToQueryString } from '@/utils/query-string';
import { FilterMenu } from '@/components/issues/FilterMenu';
import { getProjectIdFromProjectKey } from '@/utils/projects-client';
import fetcher from '@/utils/api-client';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Issues } from '@/components/issues/Issues';
import { useDebouncedSearchKey } from '@/hooks/use-search';
import { useQueryFilter } from '@/hooks/use-query-filter';
import { useRouter } from 'next/router';

const PAGE_SIZE = 10;

const filterNames = ['type_id', 'status_id', 'priority_id'];

function ProjectIssuesPage() {
  const router = useRouter();
  const { projectKey } = router.query;
  const projectId = projectKey && getProjectIdFromProjectKey(projectKey);
  const { inputValue, handleInputValueChange, searchKey } = useDebouncedSearchKey('');
  const { filters, handleFilterChange, getFilters } = useQueryFilter(filterNames);

  const getKey = useCallback(
    (pageIndex) => {
      const queryStringObj = {
        page: pageIndex,
        limit: PAGE_SIZE,
        project_id: projectId,
        search: searchKey,
        withGraph: '[type, status, priority, assignee, createdBy, updatedBy, comments]',
        orderBy: 'updated_at:desc',
        ...getFilters()
      };

      const queryString = objToQueryString(queryStringObj);

      return projectId ? ['tickets', projectId, queryString] : null;
    },
    [projectId, searchKey, getFilters]
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
    <Layout title={`Issues for ${projectKey}`}>
      <Box>
        <Heading as="h2" fontSize="lg" mt={6}>
          Issues for: {projectKey}
        </Heading>
      </Box>

      <Flex mt={4} direction={['column', null, 'row']} align={{ sm: 'center' }}>
        <Box w="full" maxW={['100%', 'xs']}>
          <InputSearch value={inputValue} handleChange={handleInputValueChange} />
        </Box>

        <SimpleGrid mt={{ base: 2, md: 0 }} ml={{ md: 4 }} columns={[2, 4]} spacing={1}>
          <Box>
            <FilterMenu
              filterName="type"
              filterValue={filters['type_id']}
              handleFilterChange={handleFilterChange('type_id')}
            />
          </Box>
          <Box>
            <FilterMenu
              filterName="status"
              filterValue={filters['status_id']}
              handleFilterChange={handleFilterChange('status_id')}
            />
          </Box>
          <Box>
            <FilterMenu
              filterName="priority"
              filterValue={filters['priority_id']}
              handleFilterChange={handleFilterChange('priority_id')}
            />
          </Box>
        </SimpleGrid>
      </Flex>

      <Box my={12}>
        {error ? (
          <Text textAlign="center">Something went wrong... Try reload the page</Text>
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
