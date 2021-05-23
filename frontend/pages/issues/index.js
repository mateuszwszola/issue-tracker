import DisplayError from '@/components/DisplayError';
import { InputSearch } from '@/components/InputSearch';
import FilterMenus from '@/components/issues/FilterMenus';
import AssignedToMeBtn from '@/components/issues/filterMenus/AssignedToMeBtn';
import { FilterMenu } from '@/components/issues/filterMenus/FilterMenu';
import { Issues } from '@/components/issues/Issues';
import { Layout } from '@/components/Layout';
import { useApiUser } from '@/contexts/api-user-context';
import { useDebouncedSearchKey } from '@/hooks/use-search';
import { useTickets } from '@/hooks/use-ticket';
import { filterObjectFalsy } from '@/utils/helpers';
import { Box, Flex, Heading, HStack, Tag, TagCloseButton, TagLabel } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

const PAGE_SIZE = 10;

function IssuesPage() {
  const { replace, query } = useRouter();
  const { user } = useApiUser();
  // Get query filters from the URL
  const { project_id, type_id, status_id, priority_id, assignee_id, search } = query;
  const { inputValue, handleInputValueChange, searchKey } = useDebouncedSearchKey(search);

  const getQueryFilters = useCallback(() => {
    return {
      project_id,
      type_id,
      status_id,
      priority_id,
      assignee_id,
      search
    };
    // If one of the filter changes, return a new function
  }, [assignee_id, priority_id, project_id, search, status_id, type_id]);

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
  } = useTickets(getQueryFilters, PAGE_SIZE);

  useEffect(() => {
    handleFilterChange('search')(searchKey);
  }, [handleFilterChange, searchKey]);

  const filtersToUrl = useCallback(
    (filters) => {
      const searchParams = new URLSearchParams();
      Object.entries(filterObjectFalsy(filters)).forEach(([filterName, filterValue]) => {
        searchParams.append(filterName, encodeURIComponent(filterValue));
      });
      searchParams.sort();
      replace(searchParams.toString() ? `/issues/?${searchParams.toString()}` : '/issues');
    },
    [replace]
  );

  const handleFilterChange = useCallback(
    (filterName) => (filterValue) => {
      filtersToUrl({
        ...getQueryFilters(),
        [filterName]: filterValue === 'All' ? '' : filterValue
      });
    },
    [filtersToUrl, getQueryFilters]
  );

  const filtersApplied = Object.keys(filterObjectFalsy(getQueryFilters())).length > 0;

  return (
    <Layout title="Issues">
      <Heading size="lg" mt={2}>
        Issues
      </Heading>

      <Flex mt={4} direction={['column', null, 'row']} align={{ sm: 'center' }}>
        <Box w="full" maxW={['100%', 'xs']}>
          <InputSearch value={inputValue} handleChange={handleInputValueChange} />
        </Box>

        <FilterMenus>
          <FilterMenu
            filterName="project"
            filterValue={project_id}
            handleFilterChange={handleFilterChange('project_id')}
            fetchUrl={`projects`}
          />
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

      {filtersApplied && (
        <HStack spacing={4} mt={4}>
          <Tag borderRadius="full" variant="solid">
            <TagLabel>Clear filter</TagLabel>
            <TagCloseButton onClick={() => filtersToUrl({})} />
          </Tag>
        </HStack>
      )}

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

export default IssuesPage;
