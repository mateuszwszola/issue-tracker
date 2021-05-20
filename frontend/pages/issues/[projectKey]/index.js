import DisplayError from '@/components/DisplayError';
import { InputSearch } from '@/components/InputSearch';
import CreateIssue from '@/components/issue/CreateIssue';
import FilterMenus from '@/components/issues/FilterMenus';
import AssignedToMeBtn from '@/components/issues/filterMenus/AssignedToMeBtn';
import { FilterMenu } from '@/components/issues/filterMenus/FilterMenu';
import { Issues } from '@/components/issues/Issues';
import { Layout } from '@/components/Layout';
import { useApiUser } from '@/contexts/api-user-context';
import { useDebouncedSearchKey } from '@/hooks/use-search';
import { useTickets } from '@/hooks/use-ticket';
import { filterObjectFalsy } from '@/utils/helpers';
import { getProjectIdFromProjectKey } from '@/utils/projects-client';
import { Box, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

const PAGE_SIZE = 10;

function ProjectIssuesPage() {
  const { replace, query } = useRouter();
  const { user } = useApiUser();
  const { projectKey, type_id, status_id, priority_id, assignee_id, search } = query;
  const projectId = projectKey && getProjectIdFromProjectKey(projectKey);
  const { inputValue, handleInputValueChange, searchKey } = useDebouncedSearchKey(search);

  const getQueryObj = useCallback(() => {
    return {
      type_id,
      status_id,
      priority_id,
      assignee_id,
      search: searchKey,
      project_id: projectId
    };
  }, [assignee_id, priority_id, projectId, searchKey, status_id, type_id]);

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

  const filtersToUrl = useCallback(
    (filters) => {
      const searchParams = new URLSearchParams();
      Object.entries(filterObjectFalsy(filters)).forEach(([filterName, filterValue]) => {
        searchParams.append(filterName, encodeURIComponent(filterValue));
      });
      searchParams.sort();
      replace(`/issues/${projectKey}?${searchParams.toString()}`);
    },
    [projectKey, replace]
  );

  const handleFilterChange = (filterName) => (filterValue) => {
    filtersToUrl({
      type_id,
      status_id,
      priority_id,
      assignee_id,
      search,
      [filterName]: filterValue
    });
  };

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

        <FilterMenus>
          <FilterMenu
            filterName="type"
            filterValue={type_id}
            handleFilterChange={handleFilterChange('type_id')}
            fetchUrl={`tickets/type`}
          />
          <FilterMenu
            filterName="status"
            filterValue={status_id}
            handleFilterChange={handleFilterChange('status_id')}
            fetchUrl={`tickets/status`}
          />
          <FilterMenu
            filterName="priority"
            filterValue={priority_id}
            handleFilterChange={handleFilterChange('priority_id')}
            fetchUrl={`tickets/priority`}
          />
          {user && (
            <Box>
              <AssignedToMeBtn
                filterValue={assignee_id}
                handleFilterChange={handleFilterChange('assignee_id')}
                userId={user.id}
              >
                Assigned to me
              </AssignedToMeBtn>
            </Box>
          )}
        </FilterMenus>
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
