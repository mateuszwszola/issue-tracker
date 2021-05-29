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
import Header from '@/components/issue/Header';
import Attachments from '@/components/issue/Attachments';
import Comments from '@/components/issue/Comments';
import { useIsUserProjectEngineer } from '@/hooks/use-project';

function Issue() {
  const router = useRouter();
  const {
    query: { key: issueKey }
  } = router;
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useApiUser();
  const issueId = issueKey && getIssueIdFromKey(issueKey);
  const { ticket: issue, isLoading: isLoadingIssue, error } = useTicket(issueId);
  const { isEngineer: isProjectEngineer } = useIsUserProjectEngineer(user?.id, issue?.project.id);

  const isAdmin = user?.is_admin;
  const isProjectManager = user && issue && user.id === issue.project?.manager_id;
  const isTicketAuthor = user && issue && user.id === issue.created_by;
  const isTicketSubmitted = issue?.status?.name === 'Submitted';

  const canManage = !!(isAdmin || isProjectManager || isProjectEngineer);
  const canEdit = canManage || !!(isTicketAuthor && isTicketSubmitted);

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
            {issue && canEdit && (
              <EditIssueControls
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                canDelete={canEdit}
                onDelete={() => router.push(`/issues`)}
                issueId={issueId}
              />
            )}

            <Box mt={{ base: 8, md: 16 }}>
              {isEditing ? (
                <EditIssue issueId={issueId} issue={issue} onEdit={() => setIsEditing(false)} />
              ) : (
                <>
                  <IssuePreview isLoading={isLoadingIssue} issue={issue}>
                    <Header issue={issue} />
                    <Attachments mt={8} issueId={issue?.id} canUpload={canEdit} />
                    <Comments mt={12} issueId={issue?.id} />
                  </IssuePreview>
                </>
              )}
            </Box>
          </>
        )}
      </Box>
    </Layout>
  );
}

export default Issue;
