import { useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { Box, Flex, Heading, SimpleGrid, Text, Link } from '@chakra-ui/react';
import { InputSearch } from '@/components/InputSearch';
import { FilterMenu } from '@/components/issues/FilterMenu';
import { getProjectIdFromProjectKey } from '@/utils/projects-client';
import { Issues } from '@/components/issues/Issues';
import { useDebouncedSearchKey } from '@/hooks/use-search';
import { useQueryFilter } from '@/hooks/use-query-filter';
import { useRouter } from 'next/router';
import CreateIssue from '@/components/issue/CreateIssue';
import { useApiUser } from '@/contexts/api-user-context';
import { useTickets } from '@/hooks/use-ticket';
import NextLink from 'next/link';

const PAGE_SIZE = 10;

const filterNames = ['type_id', 'status_id', 'priority_id'];

function ProjectIssuesPage() {
  const {
    query: { projectKey }
  } = useRouter();
  const projectId = projectKey && getProjectIdFromProjectKey(projectKey);

  const { inputValue, handleInputValueChange, searchKey } = useDebouncedSearchKey('');
  const { filters, handleFilterChange, getFilters } = useQueryFilter(filterNames);

  const getQueryObj = useCallback(() => {
    return {
      project_id: projectId,
      search: searchKey,
      ...getFilters()
    };
  }, [getFilters, projectId, searchKey]);

  const {
    error,
    results: tickets,
    isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    isRefreshing,
    isEmpty,
    size,
    fetchMore,
    mutate
  } = useTickets(getQueryObj, PAGE_SIZE);

  const { user } = useApiUser();

  return (
    <Layout title={`Issues for ${projectKey}`}>
      <Flex mt={2} w="full" justify="space-between" align="center" wrap="wrap">
        <Heading size="lg">
          Issues for:{' '}
          <NextLink href={`/project/${encodeURIComponent(projectKey)}`} passHref>
            <Link color="blue.400">{projectKey}</Link>
          </NextLink>
        </Heading>

        {user && <CreateIssue projectId={Number(projectId)} refreshIssues={() => mutate()} />}
      </Flex>

      <Flex mt={4} direction={['column', null, 'row']} align={{ sm: 'center' }}>
        <Box w="full" maxW={['100%', 'xs']}>
          <InputSearch value={inputValue} handleChange={handleInputValueChange} />
        </Box>

        <SimpleGrid mt={{ base: 2, md: 0 }} ml={{ md: 4 }} columns={[2, 4]} spacing={1}>
          <FilterMenu
            filterName="type"
            filterValue={filters['type_id']}
            handleFilterChange={handleFilterChange('type_id')}
          />
          <FilterMenu
            filterName="status"
            filterValue={filters['status_id']}
            handleFilterChange={handleFilterChange('status_id')}
          />
          <FilterMenu
            filterName="priority"
            filterValue={filters['priority_id']}
            handleFilterChange={handleFilterChange('priority_id')}
          />
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
