import { useApiUser } from '@/contexts/api-user-context';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useMutation from './use-mutation';
import { useWithTokenFetcher } from './use-token-fetcher';

export function useUser() {
  const fetcher = useWithTokenFetcher();
  const { data, mutate, error } = useSWR('auth/login', (url) => fetcher(url, { method: 'POST' }), {
    shouldRetryOnError: false
  });

  return {
    loading: !data && !error,
    error,
    user: data?.user,
    mutate
  };
}

export function useUsers() {
  const withTokenFetcher = useWithTokenFetcher();

  return useSWR('users', withTokenFetcher);
}

export function useWithAdmin(replaceUrl) {
  const router = useRouter();
  const { user } = useApiUser();
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.is_admin;

  useEffect(() => {
    if (!isAdmin) {
      router.replace(replaceUrl);
    } else {
      setIsLoading(false);
    }
  }, [isAdmin, replaceUrl, router]);

  return { isLoading };
}

export function useUpdateUser(config = {}) {
  const toast = useToast();

  const [updateUser, updateStatus] = useMutation('auth/login', {
    onSuccess: () => {
      toast({
        title: 'User updated.',
        description: "We've updated a user for you.",
        status: 'success',
        duration: 9000,
        isClosable: true
      });

      if (config.onSuccess) config.onSuccess();
    },
    onError: (err) => {
      toast({
        title: 'An error occurred.',
        description: err.message || 'Unable to update a user',
        status: 'error',
        duration: 9000,
        isClosable: true
      });

      if (config.onError) config.onError();
    }
  });

  const onSubmit = async (userId, data) => {
    await updateUser(`users/${userId}`, { body: data, method: 'PATCH' });
  };

  return [onSubmit, updateStatus];
}

export function useDeleteAccount(config = {}) {
  const toast = useToast();
  const { user } = useApiUser();

  const [deleteUser, deleteStatus] = useMutation('auth/login', {
    onSuccess: () => {
      if (config.onSuccess) config.onSuccess();
    },
    onError: (err) => {
      toast({
        title: 'An error occurred.',
        description: err.message || 'Unable to delete an account',
        status: 'error',
        duration: 9000,
        isClosable: true
      });

      if (config.onError) config.onError();
    }
  });

  const onSubmit = async () => {
    await deleteUser(`users/${user?.id}`, { method: 'DELETE' });
  };

  return [onSubmit, deleteStatus];
}
