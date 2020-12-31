import DisplayError from '@/components/DisplayError';
import { InputSearch } from '@/components/InputSearch';
import FilterMenus from '@/components/issues/FilterMenus';
import { Issues } from '@/components/issues/Issues';
import { Layout } from '@/components/Layout';
import { useApiUser } from '@/contexts/api-user-context';
import { useQueryFilter } from '@/hooks/use-query-filter';
import { useDebouncedSearchKey } from '@/hooks/use-search';
import { useTickets } from '@/hooks/use-ticket';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { useCallback } from 'react';

const PAGE_SIZE = 10;

const filterNames = ['type_id', 'status_id', 'priority_id', 'assignee_id'];

function IssuesPage() {
  const { inputValue, handleInputValueChange, searchKey } = useDebouncedSearchKey('');

  const { filters, handleFilterChange, getFilters } = useQueryFilter(filterNames);

  const { user } = useApiUser();

  const getQueryObj = useCallback(() => {
    return {
      search: searchKey,
      ...getFilters()
    };
  }, [getFilters, searchKey]);

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
  } = useTickets(getQueryObj, PAGE_SIZE);

  return (
    <Layout title="Issues">
      <Heading size="lg" mt={2}>
        All issues
      </Heading>

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

export default IssuesPage;
