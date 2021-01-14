import { useCallback, useState } from 'react';
import { mutate } from 'swr';
import { useAuth0 } from '@auth0/auth0-react';
import client from '@/utils/api-client';
import useIsMounted from './use-is-mounted';

function useMutation(key, config = {}) {
  const { getAccessTokenSilently } = useAuth0();
  const [status, setStatus] = useState('idle');
  const isMounted = useIsMounted();

  const mutateCallback = useCallback(
    async (url, { body, ...clientOptions } = {}) => {
      const { onSuccess = () => {}, onMutate = () => {}, onError = () => {} } = config;

      onMutate(body);

      if (isMounted.current) {
        setStatus('loading');
      }

      try {
        const token = await getAccessTokenSilently();
        const data = await client(url, { body, token, ...clientOptions });

        onSuccess(data);

        mutate(key);

        if (isMounted.current) setStatus('success');
      } catch (err) {
        onError(err);

        if (isMounted.current) setStatus('error');
      }
    },
    [config, isMounted, getAccessTokenSilently, key]
  );

  return [mutateCallback, status];
}

export default useMutation;
