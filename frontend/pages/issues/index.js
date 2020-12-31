import DisplayError from '@/components/DisplayError';
import { InputSearch } from '@/components/InputSearch';
import AssignedToMeBtn from '@/components/issues/AssignedToMeBtn';
import { FilterMenu } from '@/components/issues/FilterMenu';
import { Issues } from '@/components/issues/Issues';
import { Layout } from '@/components/Layout';
import { useApiUser } from '@/contexts/api-user-context';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { useQueryFilter } from '@/hooks/use-query-filter';
import { useDebouncedSearchKey } from '@/hooks/use-search';
import fetcher from '@/utils/api-client';
import { objToQueryString } from '@/utils/query-string';
import { Box, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useCallback } from 'react';

const PAGE_SIZE = 10;

const filterNames = ['type_id', 'status_id', 'priority_id', 'assignee_id'];

function IssuesPage() {
  const { inputValue, handleInputValueChange, searchKey } = useDebouncedSearchKey('');

  const { filters, handleFilterChange, getFilters } = useQueryFilter(filterNames);

  const { user } = useApiUser();

  const getKey = useCallback(
    (pageIndex) => {
      const queryStringObj = {
        page: pageIndex,
        limit: PAGE_SIZE,
        search: searchKey,
        withGraph: '[type, status, priority, assignee, createdBy, updatedBy, comments]',
        orderBy: 'updated_at:desc',
        ...getFilters()
      };

      const queryString = objToQueryString(queryStringObj);

      return `tickets?${queryString}`;
    },
    [searchKey, getFilters]
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
    <Layout title="Issues">
      <Heading size="lg" mt={2}>
        All issues
      </Heading>

      <Flex mt={4} direction={['column', null, 'row']} align={{ sm: 'center' }}>
        <Box w="full" maxW={['100%', 'xs']}>
          <InputSearch value={inputValue} handleChange={handleInputValueChange} />
        </Box>

        <SimpleGrid mt={{ base: 2, md: 0 }} ml={{ md: 4 }} columns={[2, 4]} spacing={4}>
          <FilterMenu
            filterName="type"
            filterValue={filters['type_id']}
            handleFilterChange={handleFilterChange('type_id')}
            fetchUrl={`tickets/type`}
          />
          <FilterMenu
            filterName="status"
            filterValue={filters['status_id']}
            handleFilterChange={handleFilterChange('status_id')}
            fetchUrl={`tickets/status`}
          />
          <FilterMenu
            filterName="priority"
            filterValue={filters['priority_id']}
            handleFilterChange={handleFilterChange('priority_id')}
            fetchUrl={`tickets/priority`}
          />
          {user && (
            <Box>
              <AssignedToMeBtn
                filterValue={String(filters['assignee_id'])}
                handleFilterChange={handleFilterChange('assignee_id')}
                userId={user.id}
              >
                Assigned to me
              </AssignedToMeBtn>
            </Box>
          )}
        </SimpleGrid>
      </Flex>

      <Box my={12}>
        {error ? (
          <DisplayError message="Something went wrong... Try reload the page" />
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
