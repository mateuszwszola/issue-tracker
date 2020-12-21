import { useRouter } from 'next/router';

function useRouterKey() {
  const router = useRouter();
  const { key } = router.query;

  return key;
}

export default useRouterKey;
