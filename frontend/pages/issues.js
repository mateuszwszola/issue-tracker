import { Issues } from '@/components/Issues';
import { Layout } from '@/components/Layout';
import { useFetchUser } from 'utils/user';

function IssuesPage() {
  const { user, loading } = useFetchUser();

  return (
    <Layout user={user} loading={loading} title="Issues">
      <Issues />
    </Layout>
  );
}

export default IssuesPage;
