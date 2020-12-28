import DisplayError from '@/components/DisplayError';
import IssueAboutPreview from '@/components/issue/AboutPreview';
import Attachments from '@/components/issue/Attachments';
import Comments from '@/components/issue/Comments';
import EditIssueControls from '@/components/issue/EditControls';
import IssueHeaderPreview from '@/components/issue/HeaderPreview';
import { Layout } from '@/components/Layout';
import { useApiUser } from '@/contexts/api-user-context';
import client from '@/utils/api-client';
import { getIssueIdFromKey } from '@/utils/helpers';
import { objToQueryString } from '@/utils/query-string';
import { Box, Flex, SkeletonText } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';

const queryString = objToQueryString({
  withGraph:
    '[type, status, priority, assignee, createdBy, updatedBy, comments, project, subTicket]'
});

function Issue() {
  const {
    query: { key: issueKey }
  } = useRouter();

  const issueId = issueKey && getIssueIdFromKey(issueKey);

  const { data, error } = useSWR(issueId ? `tickets/${issueId}?${queryString}` : null, client);

  const isLoading = !error && !data;
  const ticket = data?.ticket;

  const [isEditing, setIsEditing] = useState(false);

  const { user } = useApiUser();

  const isAdmin = user?.is_admin;
  const isProjectManager = user && ticket && user.id === ticket.project?.manager_id;
  const isAssignee = user && ticket && user.id === ticket.assignee_id;
  const isSubmitter = user && ticket && user.id === ticket.created_by;

  const canEdit = isAdmin || isProjectManager || isAssignee || isSubmitter;

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
            {canEdit && <EditIssueControls isEditing={isEditing} setIsEditing={setIsEditing} />}

            <Flex
              mt={{ base: 8, md: 16 }}
              direction={{ base: 'column', md: 'row-reverse' }}
              justify={{ md: 'space-between' }}
            >
              <IssueAboutPreview isLoading={isLoading} ticket={ticket} />

              <Box mt={{ base: 6, md: 0 }} pr={{ md: 8 }} w="full" maxW={{ md: '640px' }}>
                {isLoading ? (
                  <Box py={4}>
                    <SkeletonText noOfLines={3} />
                  </Box>
                ) : (
                  <IssueHeaderPreview ticket={ticket} />
                )}

                <Attachments mt={8} />

                <Comments mt={12} />
              </Box>
            </Flex>
          </>
        )}
      </Box>
    </Layout>
  );
}

export default Issue;
