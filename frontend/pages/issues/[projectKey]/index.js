import DisplayError from '@/components/DisplayError';
import { InputSearch } from '@/components/InputSearch';
import CreateIssue from '@/components/issue/CreateIssue';
import FilterMenus from '@/components/issues/FilterMenus';
import { Issues } from '@/components/issues/Issues';
import { Layout } from '@/components/Layout';
import { useApiUser } from '@/contexts/api-user-context';
import { useQueryFilter } from '@/hooks/use-query-filter';
import { useDebouncedSearchKey } from '@/hooks/use-search';
import { useTickets } from '@/hooks/use-ticket';
import { getProjectIdFromProjectKey } from '@/utils/projects-client';
import { Box, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

const PAGE_SIZE = 10;

const filterNames = ['type_id', 'status_id', 'priority_id', 'assignee_id'];

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

        <FilterMenus filters={filters} handleFilterChange={handleFilterChange} user={user} />
      </Flex>

      <Box my={12}>
        {error ? (
          <DisplayError textAlign="center" message="Something went wrong... Try reload the page" />
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
