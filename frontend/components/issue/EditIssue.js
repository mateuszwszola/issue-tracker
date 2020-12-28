import PropTypes from 'prop-types';
import IssueForm from '@/components/issue/IssueForm';
import { useUpdateTicket } from '@/hooks/use-ticket';
import { Box, Heading } from '@chakra-ui/react';
import { FullPageSpinner } from '../Loading';

function EditIssue({ issueId, issue, onEdit }) {
  const [updateTicket, updateStatus] = useUpdateTicket(issueId, {
    onSuccess: () => onEdit()
  });

  return (
    <>
      {!issue ? (
        <FullPageSpinner />
      ) : (
        <Box w="full" maxW="500px" mx="auto">
          <Heading mb={6} textAlign="center" size="xl">
            Edit Issue
          </Heading>
          <IssueForm
            onSubmit={updateTicket}
            submitStatus={updateStatus}
            projectId={issue.project_id}
            initialNameValue={issue.name || ''}
            initialDescValue={issue.description || ''}
            initialTypeValue={issue.type_id}
            initialPriorityValue={issue.priority_id}
            initialAssigneeValue={issue.assignee_id}
          />
        </Box>
      )}
    </>
  );
}

EditIssue.propTypes = {
  issue: PropTypes.object,
  issueId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default EditIssue;
