import PropTypes from 'prop-types';
import { ButtonGroup, Flex, Text } from '@chakra-ui/react';
import { ActionButton } from '@/components/Button';
import { useDeleteTicket } from '@/hooks/use-ticket';
import { useState } from 'react';

function DeleteIssue({ issueId, onDelete }) {
  const [deleteIssue, deleteStatus] = useDeleteTicket(issueId, {
    onSuccess: () => onDelete()
  });

  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      {isDeleting ? (
        <>
          <Text>Are you sure?</Text>
          <ButtonGroup>
            <ActionButton
              isLoading={deleteStatus === 'loading'}
              onClick={deleteIssue}
              colorScheme="red"
            >
              Delete
            </ActionButton>

            <ActionButton onClick={() => setIsDeleting(false)}>Cancel</ActionButton>
          </ButtonGroup>
        </>
      ) : (
        <ActionButton onClick={() => setIsDeleting(true)} colorScheme="red">
          Delete
        </ActionButton>
      )}
    </>
  );
}

DeleteIssue.propTypes = {
  issueId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
};

function EditIssueControls({ isEditing, setIsEditing, canDelete, issueId, onDelete }) {
  return (
    <Flex w="full" justify="flex-end">
      {isEditing ? (
        <ButtonGroup>
          {canDelete && <DeleteIssue issueId={issueId} onDelete={onDelete} />}
          <ActionButton onClick={() => setIsEditing(false)}>Cancel</ActionButton>
        </ButtonGroup>
      ) : (
        <>
          <ActionButton onClick={() => setIsEditing(true)}>Edit</ActionButton>
        </>
      )}
    </Flex>
  );
}

EditIssueControls.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  canDelete: PropTypes.bool.isRequired,
  issueId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default EditIssueControls;
