import { useState } from 'react';
import PropTypes from 'prop-types';
import { MdDelete } from 'react-icons/md';
import { Button, ButtonGroup, IconButton, useToast } from '@chakra-ui/react';
import { useDeleteComment } from '@/hooks/use-comment';

function DeleteComment({ issueId, commentId, mutate }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  const [onDelete, deleteStatus] = useDeleteComment(issueId, {
    onMutate: () => {
      mutate((data) => {
        return [
          ...data.map((d) => ({
            comments: d.comments.filter((c) => c.id !== commentId)
          }))
        ];
      }, false);
      toast({
        title: 'Comment deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    },
    onSuccess: () => {
      mutate();
    },
    onError: () => {
      mutate();
    }
  });

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
            onClick={() => onDelete(commentId)}
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
  issueId: PropTypes.number.isRequired,
  commentId: PropTypes.number.isRequired,
  mutate: PropTypes.func.isRequired
};

export default DeleteComment;
