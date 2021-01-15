import { useToast } from '@chakra-ui/react';
import useMutation from './use-mutation';

export function useCreateComment(issueId, config = {}) {
  const toast = useToast();

  const [createComment, createCommentStatus] = useMutation(`tickets/${issueId}/comments`, {
    onMutate: (body) => {
      if (config.onMutate) config.onMutate(body);
    },
    onSuccess: (data) => {
      if (config.onSuccess) config.onSuccess(data);
    },
    onError: (err) => {
      toast({
        title: 'Unable to add a comment',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });

      if (config.onError) config.onError(err);
    }
  });

  const onSubmit = (data) => {
    return createComment(`tickets/${issueId}/comments`, { body: data });
  };

  return [onSubmit, createCommentStatus];
}

export function useUpdateComment(issueId, config = {}) {
  const toast = useToast();

  const [updateComment, updateCommentStatus] = useMutation(`tickets/${issueId}/comments`, {
    onMutate: (body) => {
      if (config.onMutate) config.onMutate(body);
    },
    onSuccess: (data) => {
      if (config.onSuccess) config.onSuccess(data);
    },
    onError: (err) => {
      toast({
        title: 'Unable to update a comment',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });

      if (config.onError) config.onError(err);
    }
  });

  const onSubmit = (commentId, data) => {
    return updateComment(`tickets/${issueId}/comments/${commentId}`, {
      body: data,
      method: 'PATCH'
    });
  };

  return [onSubmit, updateCommentStatus];
}

export function useDeleteComment(issueId, config = {}) {
  const toast = useToast();

  const [deleteComment, deleteCommentStatus] = useMutation(`tickets/${issueId}/comments`, {
    onMutate: () => {
      if (config.onMutate) config.onMutate();
    },
    onSuccess: () => {
      if (config.onSuccess) config.onSuccess();
    },
    onError: (err) => {
      toast({
        title: 'Unable to delete a comment',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });

      if (config.onError) config.onError();
    }
  });

  const onSubmit = (commentId) => {
    return deleteComment(`tickets/${issueId}/comments/${commentId}`, { method: 'DELETE' });
  };

  return [onSubmit, deleteCommentStatus];
}
