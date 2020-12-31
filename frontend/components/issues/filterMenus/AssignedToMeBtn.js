import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';

function AssignedToMeBtn({ filterValue, handleFilterChange, userId, children, ...props }) {
  const handleBtnClick = filterValue
    ? () => handleFilterChange('')
    : () => handleFilterChange(String(userId));

  return (
    <Button
      onClick={handleBtnClick}
      size="sm"
      rounded="full"
      variant="outline"
      rightIcon={filterValue ? <MdClose /> : null}
      {...props}
    >
      {children}
    </Button>
  );
}

AssignedToMeBtn.propTypes = {
  filterValue: PropTypes.string.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  children: PropTypes.string.isRequired
};

export default AssignedToMeBtn;