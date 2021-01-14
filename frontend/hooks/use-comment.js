import { useToast } from '@chakra-ui/react';
import useMutation from './use-mutation';

export function useCreateComment(issueId, config) {
  const toast = useToast();

  const [createComment, createCommentStatus] = useMutation(`tickets/${issueId}/comments`, {
    onMutate: () => {
      if (config.onMutate) config.onMutate();
    },
    onSuccess: () => {
      toast({
        title: 'Comment added.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      if (config.onSuccess) config.onSuccess();
    },
    onError: (err) => {
      toast({
        title: 'Unable to add a comment',
        description: err.message,
        status: 'error',
        duration: 9000,
        isClosable: true
      });

      if (config.onError) config.onError();
    }
  });

  const onSubmit = (data) => {
    return createComment(`tickets/${issueId}/comments`, { body: data });
  };

  return [onSubmit, createCommentStatus];
}
