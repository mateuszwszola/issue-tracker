import DisplayError from '@/components/DisplayError';
import EditIssueControls from '@/components/issue/EditControls';
import EditIssue from '@/components/issue/EditIssue';
import IssuePreview from '@/components/issue/IssuePreview';
import { Layout } from '@/components/Layout';
import { useApiUser } from '@/contexts/api-user-context';
import { useTicket } from '@/hooks/use-ticket';
import { getIssueIdFromKey } from '@/utils/helpers';
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

function Issue() {
  const router = useRouter();
  const {
    query: { key: issueKey }
  } = router;

  const issueId = issueKey && getIssueIdFromKey(issueKey);

  const { data, error } = useTicket(issueId);

  const isLoading = !error && !data;
  const issue = data?.ticket;

  const { user } = useApiUser();

  const isAdmin = user?.is_admin;
  const isProjectManager = user && issue && user.id === issue.project?.manager_id;
  const isAssignee = user && issue && user.id === issue.assignee_id;
  const isSubmitter = user && issue && user.id === issue.created_by;

  const canEdit = isAdmin || isProjectManager || isAssignee || isSubmitter;
  const canDelete = isAdmin || isProjectManager || isSubmitter;

  const [isEditing, setIsEditing] = useState(false);

  return (
    <Layout title={`Issue - ${issueKey}`}>
      <Box>
        {error ? (
          <DisplayError
            mt={{ base: 8, md: 16 }}
            textAlign="center"
            message={error.message || 'Something went wrong... Sorry'}
          />
        ) : (
          <>
            {canEdit && issue && (
              <EditIssueControls
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                canDelete={canDelete}
                onDelete={() => router.push(`/issues`)}
                issueId={issueId}
              />
            )}

            <Box mt={{ base: 8, md: 16 }}>
              {isEditing ? (
                <EditIssue issueId={issueId} issue={issue} onEdit={() => setIsEditing(false)} />
              ) : (
                <IssuePreview isLoading={isLoading} issue={issue} />
              )}
            </Box>
          </>
        )}
      </Box>
    </Layout>
  );
}

export default Issue;
