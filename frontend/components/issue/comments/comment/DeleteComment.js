import { Button, ButtonGroup, IconButton } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';

function DeleteComment({ onDelete, deleteStatus }) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      {!isDeleting ? (
        <IconButton
          onClick={() => setIsDeleting(true)}
          aria-label="Delete comment"
          icon={<MdDelete />}
          size="md"
          variant="ghost"
        />
      ) : (
        <ButtonGroup size="sm" variant="ghost">
          <Button
            onClick={onDelete}
            isLoading={deleteStatus === 'loading'}
            aria-label="Delete comment"
          >
            Delete
          </Button>

          <Button onClick={() => setIsDeleting(false)} aria-label="Cancel delete">
            Cancel
          </Button>
        </ButtonGroup>
      )}
    </>
  );
}

DeleteComment.propTypes = {
  onDelete: PropTypes.func.isRequired,
  deleteStatus: PropTypes.string.isRequired
};

export default DeleteComment;
