import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Textarea, useToast } from '@chakra-ui/react';
import { useApiUser } from '@/contexts/api-user-context';
import { useCreateComment } from '@/hooks/use-comment';

function CreateComment({ issueId, mutate, size }) {
  const { loginWithRedirect } = useAuth0();
  const { user } = useApiUser();
  const toast = useToast();
  const [text, setText] = useState('');

  const [addComment, addCommentStatus] = useCreateComment(issueId, {
    onMutate: (body) => {
      const newComment = {
        ...body,
        user_id: user.id,
        ticket_id: issueId,
        created_at: new Date(),
        author: {
          ...user
        }
      };

      mutate(
        (data) => [
          ...data.slice(0, size - 1),
          { comments: [...data[size - 1].comments, newComment] }
        ],
        false
      );

      setText('');

      toast({
        title: 'Comment added.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    },
    onSuccess: () => {
      mutate();
    }
  });

  const onAddComment = () => {
    addComment({ comment: text });
  };

  return (
    <>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!user || addCommentStatus === 'loading'}
      />

      {!user ? (
        <Button mt={1} variant="solid" colorScheme="blue" size="sm" onClick={loginWithRedirect}>
          Sign in to add a comment
        </Button>
      ) : (
        <Button
          mt={1}
          colorScheme="blue"
          size="sm"
          onClick={onAddComment}
          isLoading={addCommentStatus === 'loading'}
          isDisabled={!text}
        >
          Add a comment
        </Button>
      )}
    </>
  );
}

CreateComment.propTypes = {
  issueId: PropTypes.number.isRequired,
  mutate: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired
};

export default CreateComment;
