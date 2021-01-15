import { useState } from 'react';
import PropTypes from 'prop-types';
import { MdDelete, MdDone } from 'react-icons/md';
import { useUpdateComment, useDeleteComment } from '@/hooks/use-comment';
import { ButtonGroup, Flex, IconButton, Textarea, useToast } from '@chakra-ui/react';

function CommentEditor({ issueId, commentId, initialComment, mutate, setIsEditing }) {
  const toast = useToast();
  const [text, setText] = useState(initialComment);

  const [updateComment] = useUpdateComment(issueId, {
    onMutate: async (body) => {
      await mutate((data) => {
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

      setIsEditing(false);
    },
    onSuccess: () => {
      mutate();
    },
    onError: () => {
      mutate();
    }
  });

  const [deleteComment] = useDeleteComment(issueId, {
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

  const onUpdate = () => {
    if (initialComment === text) {
      return setIsEditing(false);
    }

    updateComment(commentId, { comment: text });
  };

  const onDelete = () => {
    deleteComment(commentId);
  };

  return (
    <>
      <Flex w="full" justify="flex-end">
        <ButtonGroup variant="ghost">
          <IconButton onClick={onUpdate} aria-label="Save comment" icon={<MdDone />} />
          <IconButton onClick={onDelete} aria-label="Delete comment" icon={<MdDelete />} />
        </ButtonGroup>
      </Flex>

      <Textarea mt={2} value={text} onChange={(e) => setText(e.target.value)} />
    </>
  );
}

CommentEditor.propTypes = {
  issueId: PropTypes.number.isRequired,
  commentId: PropTypes.number.isRequired,
  initialComment: PropTypes.string.isRequired,
  mutate: PropTypes.func.isRequired,
  setIsEditing: PropTypes.func.isRequired
};

export default CommentEditor;
