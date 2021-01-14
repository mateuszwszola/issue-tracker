import PropTypes from 'prop-types';
import { Textarea, useToast } from '@chakra-ui/react';
import { useUpdateComment } from '@/hooks/use-comment';

function EditComment({ issueId, commentId, mutate }) {
  const toast = useToast();

  const [updateComment, updateCommentStatus] = useUpdateComment(issueId, {
    onMutate: (body) => {
      mutate((data) => {
        return [
          ...data.map((d) => ({
            comments: d.comments.map((c) => {
              if (c !== commentId) return c;

              return {
                ...c,
                ...body
              };
            })
          }))
        ];
      }, false);
      toast({
        title: 'Comment updated.',
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
      <Textarea />
    </>
  );
}

EditComment.propTypes = {
  issueId: PropTypes.number.isRequired,
  commentId: PropTypes.number.isRequired,
  mutate: PropTypes.func.isRequired
};

export default EditComment;
