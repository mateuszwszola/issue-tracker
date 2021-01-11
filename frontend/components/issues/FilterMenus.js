import { Box, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import AssignedToMeBtn from '@/components/issues/filterMenus/AssignedToMeBtn';
import { FilterMenu } from '@/components/issues/filterMenus/FilterMenu';

function FilterMenus({ filters, handleFilterChange, user }) {
  return (
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
  );
}

FilterMenus.propTypes = {
  filters: PropTypes.object.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default FilterMenus;
