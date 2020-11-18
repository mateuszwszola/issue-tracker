import { useRouter } from 'next/router';
import { Heading } from '@chakra-ui/react';

function Issue() {
  const router = useRouter();
  const { key: issueKey } = router.query;

  return (
    <>
      <Heading size="lg">Issue page for: ${issueKey}</Heading>
    </>
  );
}

export default Issue;
