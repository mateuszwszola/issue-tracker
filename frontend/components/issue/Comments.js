import PropTypes from 'prop-types';
import { Box, Button, StackDivider, Text, VStack } from '@chakra-ui/react';

import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import client from '@/utils/api-client';
import Comment from '@/components/issue/comments/Comment';
import CreateComment from '@/components/issue/comments/CreateComment';

const PAGE_SIZE = 10;

function Comments({ issueId }) {
  const {
    results: comments,
    error,
    mutate,
    isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    isEmpty,
    size,
    fetchMore
  } = useInfiniteScroll(
    (index) => `tickets/${issueId}/comments?page=${index}&limit=10`,
    client,
    'comments',
    PAGE_SIZE
  );

  return (
    <Box mt={2} width="full" maxWidth="700px">
      <Text textAlign="right" fontSize="sm" mt={1} mb={2} color="gray.500">
        Comments {isLoadingMore ? '...' : comments?.length || 0}
      </Text>

      <CreateComment issueId={issueId} mutate={mutate} size={size} />

      {error ? (
        <Text textAlign="center">Unable to load comments</Text>
      ) : isLoadingInitialData ? (
        <Text textAlign="center">Loading...</Text>
      ) : (
        <>
          {isEmpty && <Text textAlign="center">No comments found</Text>}

          <VStack spacing={8} mt={4} divider={<StackDivider />}>
            {comments.map((comment) => (
              <Comment
                key={comment.created_at}
                issueId={issueId}
                comment={comment}
                mutate={mutate}
              />
            ))}
          </VStack>

          {!isEmpty && (
            <Button
              size="sm"
              variant="ghost"
              d="block"
              mx="auto"
              mt={4}
              disabled={isReachingEnd}
              isLoading={isLoadingMore}
              onClick={fetchMore}
            >
              Load more comments
            </Button>
          )}
        </>
      )}
    </Box>
  );
}

Comments.propTypes = {
  issueId: PropTypes.number
};

export default Comments;
