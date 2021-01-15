import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { Avatar, Box, Flex, Heading, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

function CommentPreview({ comment }) {
  const createdAt = format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm');

  return (
    <Box w="full">
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

      <Box mt={2} pl={10} pr={10}>
        <Text>{comment.comment}</Text>
      </Box>
    </Box>
  );
}

CommentPreview.propTypes = {
  comment: PropTypes.object.isRequired
};

export default CommentPreview;
