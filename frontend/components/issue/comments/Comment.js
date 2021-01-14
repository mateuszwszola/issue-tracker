import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Avatar, Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useApiUser } from '@/contexts/api-user-context';
import DeleteComment from '@/components/issue/comments/comment/DeleteComment';
// import { useState } from 'react';

function Comment({ comment, issueId, mutate }) {
  const { user } = useApiUser();

  const createdAt = format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm');

  const canManage = user?.is_admin || user?.id === comment.user_id;

  // const [isEditting, setIsEditting] = useState(false);

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

        {canManage && (
          <>
            <DeleteComment issueId={issueId} commentId={comment.id} mutate={mutate} />
          </>
        )}
      </Flex>

      <Box mt={2} pl={10} pr={10}>
        <Text>{comment.comment}</Text>
      </Box>
    </Box>
  );
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  issueId: PropTypes.number.isRequired,
  mutate: PropTypes.func.isRequired
};

export default Comment;
