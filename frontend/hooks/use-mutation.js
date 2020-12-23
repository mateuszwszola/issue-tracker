import { useCallback, useState } from 'react';
import { useWithTokenFetcher } from '@/hooks/use-token-fetcher';
import { mutate } from 'swr';

function useMutation(key, config = {}) {
  const [status, setStatus] = useState('idle');
  const fetcher = useWithTokenFetcher();

  const mutateCallback = useCallback(
    async (url, { body, ...clientOptions } = {}) => {
      const { onSuccess = () => {}, onMutate = () => {}, onError = () => {} } = config;

      onMutate(body);

      setStatus('loading');

      try {
        const data = await fetcher(url, { body, ...clientOptions });

        setStatus('success');

        onSuccess(data);

        await mutate(key);
      } catch (err) {
        setStatus('error');

        onError(err);
      }
    },
    [key, config, fetcher]
  );

  return [mutateCallback, status];
}

export default useMutation;
