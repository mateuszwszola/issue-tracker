import { useState } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { format } from 'date-fns';
import useSWR from 'swr';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  StackDivider,
  Text,
  Textarea,
  VStack
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { useAuth0 } from '@auth0/auth0-react';

import { useApiUser } from '@/contexts/api-user-context';
import { useCreateComment } from '@/hooks/use-comment';
import client from '@/utils/api-client';

function Comment({ comment }) {
  const createdAt = format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm');

  return (
    <Box w="full">
      <Flex borderRadius="5px" justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          <Avatar size="sm" src={comment.author?.picture} />
          <Box ml={2}>
            <NextLink href={`/user/${comment.author?.id}`} passHref>
              <Heading as="a" size="sm">
                {comment.author?.name}
              </Heading>
            </NextLink>

            <Text fontSize="xs" color="gray.500">
              {createdAt}
            </Text>
          </Box>
        </Flex>
        <IconButton aria-label="Delete comment" icon={<MdDelete />} size="md" variant="ghost" />
      </Flex>
      <Box mt={2} pl={10} pr={10}>
        <Text>{comment.comment}</Text>
      </Box>
    </Box>
  );
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired
};

function Comments({ issueId }) {
  const { loginWithRedirect } = useAuth0();
  const { user } = useApiUser();
  const [text, setText] = useState('');
  const { data, error, mutate } = useSWR(`tickets/${issueId}/comments`, client);

  const [addComment, addCommentStatus] = useCreateComment(issueId, {
    onMutate: () => {
      const newComment = {
        id: new Date(),
        comment: text,
        user_id: user.id,
        ticket_id: issueId,
        created_at: new Date(),
        author: {
          ...user
        }
      };

      mutate(
        (data) => ({
          comments: [...(data.comments || []), newComment]
        }),
        false
      );
    },
    onSuccess: () => {
      setText('');
    }
  });

  const onAddComment = () => {
    addComment({ comment: text });
  };

  return (
    <Box mt={2} width="full" maxWidth="700px">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!user || addCommentStatus === 'loading'}
      />

      {!user ? (
        <Button colorScheme="blue" size="sm" onClick={loginWithRedirect}>
          Sign in to add a comment
        </Button>
      ) : (
        <Button
          colorScheme="blue"
          size="sm"
          onClick={onAddComment}
          isLoading={addCommentStatus === 'loading'}
          isDisabled={!text}
        >
          Add a comment
        </Button>
      )}

      <Text textAlign="right" fontSize="sm" mt={1} mb={1} color="gray.500">
        Comments {!data ? '...' : data.comments?.length}
      </Text>

      {error ? (
        <Text textAlign="center">Unable to load comments</Text>
      ) : !data ? (
        <Text textAlign="center">No comments found</Text>
      ) : (
        <VStack spacing={8} mt={4} divider={<StackDivider />}>
          {data.comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </VStack>
      )}
    </Box>
  );
}

Comments.propTypes = {
  issueId: PropTypes.number.isRequired
};

export default Comments;
