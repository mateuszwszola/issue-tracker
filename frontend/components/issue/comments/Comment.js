import { useApiUser } from '@/contexts/api-user-context';
import { useDeleteComment } from '@/hooks/use-comment';
import { Avatar, Box, Flex, Heading, Text, useToast } from '@chakra-ui/react';
import { format } from 'date-fns';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import DeleteComment from '@/components/issue/comments/comment/DeleteComment';

function Comment({ comment, issueId, mutate }) {
  const { user } = useApiUser();
  const toast = useToast();

  const [deleteComment, deleteCommentStatus] = useDeleteComment(issueId, {
    onMutate: () => {
      mutate((data) => {
        return [
          ...data.map((d) => ({
            comments: d.comments.filter((c) => c.id !== comment.id)
          }))
        ];
      }, false);
      toast({
        title: 'Comment deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const createdAt = format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm');

  const canManage = user.is_admin || user.id === comment.user_id;

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
          <DeleteComment
            onDelete={() => deleteComment(comment.id)}
            deleteStatus={deleteCommentStatus}
          />
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
