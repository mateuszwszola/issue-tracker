import useSWR from 'swr';
import client from '@/utils/api-client';
import { useToast } from '@chakra-ui/react';
import useMutation from '@/hooks/use-mutation';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { objToQueryString } from '@/utils/query-string';
import { useCallback } from 'react';
import { getTicket } from '@/utils/tickets-client';

export function useTicket(ticketId) {
  return useSWR(ticketId ? ['tickets', ticketId] : null, () => getTicket(ticketId));
}

export function useTickets(getQueryObj, PAGE_SIZE = 10) {
  const getKey = useCallback(
    (pageIndex) => {
      const queryStringObj = {
        page: pageIndex,
        limit: PAGE_SIZE,
        withGraph: '[type, status, priority, assignee, createdBy, updatedBy, comments]',
        orderBy: 'updated_at:desc',
        ...getQueryObj()
      };

      const queryString = objToQueryString(queryStringObj);

      return () => `tickets?${queryString}`;
    },
    [PAGE_SIZE, getQueryObj]
  );

  return useInfiniteScroll(getKey, client, 'tickets', PAGE_SIZE);
}

export function useCreateTicket(config = {}) {
  const toast = useToast();

  const [createIssue, createIssueStatus] = useMutation('tickets', {
    onSuccess: (data) => {
      toast({
        title: 'Issue created.',
        description: "We've created issue for you.",
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      if (config.onSuccess) config.onSuccess(data);
    },
    onError: (err) => {
      toast({
        title: 'An error occurred.',
        description: err.message || 'Unable to create issue',
        status: 'error',
        duration: 5000,
        isClosable: true
      });

      if (config.onError) config.onError(err);
    }
  });

  const onSubmit = async (data) => {
    await createIssue('tickets', { body: data });
  };

  return [onSubmit, createIssueStatus];
}

export function useUpdateTicket(ticketId, config = {}) {
  const toast = useToast();

  const [updateIssue, updateIssueStatus] = useMutation(['tickets', ticketId], {
    onSuccess: (data) => {
      toast({
        title: 'Issue updated.',
        description: "We've updated issue for you.",
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      if (config.onSuccess) config.onSuccess(data);
    },
    onError: (err) => {
      toast({
        title: 'An error occurred.',
        description: err.message || 'Unable to update issue',
        status: 'error',
        duration: 5000,
        isClosable: true
      });

      if (config.onError) config.onError(err);
    }
  });

  const onSubmit = async (data) => {
    await updateIssue(`tickets/${ticketId}`, { body: data, method: 'PATCH' });
  };

  return [onSubmit, updateIssueStatus];
}

export function useDeleteTicket(ticketId, config = {}) {
  const toast = useToast();

  const [deleteIssue, deleteIssueStatus] = useMutation(['tickets', ticketId], {
    onSuccess: (data) => {
      toast({
        title: 'Issue removed.',
        description: "We've removed issue for you.",
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      if (config.onSuccess) config.onSuccess(data);
    },
    onError: (err) => {
      toast({
        title: 'An error occurred.',
        description: err.message || 'Unable to remove issue',
        status: 'error',
        duration: 5000,
        isClosable: true
      });

      if (config.onError) config.onError(err);
    }
  });

  const onSubmit = async () => {
    await deleteIssue(`tickets/${ticketId}`, { method: 'DELETE' });
  };

  return [onSubmit, deleteIssueStatus];
}
