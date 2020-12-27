import useSWR from 'swr';
import client from '@/utils/api-client';
import { useToast } from '@chakra-ui/react';
import useMutation from '@/hooks/use-mutation';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { objToQueryString } from '@/utils/query-string';
import { useCallback } from 'react';

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

export function useCreateTicket(config) {
  const toast = useToast();

  const [createIssue, createIssueStatus] = useMutation('tickets', {
    onSuccess: () => {
      toast({
        title: 'Issue created.',
        description: "We've created issue for you.",
        status: 'success',
        duration: 9000,
        isClosable: true
      });

      if (config.onSuccess) config.onSuccess();
    },
    onError: (err) => {
      toast({
        title: 'An error occurred.',
        description: err.message || 'Unable to create issue',
        status: 'error',
        duration: 9000,
        isClosable: true
      });

      if (config.onError) config.onError();
    }
  });

  const onSubmit = async (data) => {
    await createIssue('tickets', { body: data });
  };

  return [onSubmit, createIssueStatus];
}

export function useTicketTypes() {
  const { data, error, ...swrData } = useSWR('tickets/type', client);

  return {
    ticketTypes: data?.types,
    isLoading: !data && !error,
    error,
    ...swrData
  };
}

export function useTicketStatuses() {
  const { data, error, ...swrData } = useSWR('tickets/status', client);

  return {
    statuses: data?.statuses,
    isLoading: !data && !error,
    error,
    ...swrData
  };
}

export function useTicketPriorities() {
  const { data, error, ...swrData } = useSWR('tickets/priority', client);

  return {
    priorities: data?.priorities,
    isLoading: !data && !error,
    error,
    ...swrData
  };
}
