import PropTypes from 'prop-types';
import { ButtonGroup, Flex, Text } from '@chakra-ui/react';
import { ActionButton } from '@/components/Button';
import { useDeleteTicket } from '@/hooks/use-ticket';
import { useState } from 'react';

function DeleteIssue({ issueId, onDelete, isDeleting, setIsDeleting }) {
  const [deleteIssue, deleteStatus] = useDeleteTicket(issueId, {
    onSuccess: () => onDelete()
  });

  return (
    <>
      {isDeleting ? (
        <Flex align="center">
          <Text mr={2}>Are you sure?</Text>

          <ButtonGroup>
            <ActionButton
              isLoading={deleteStatus === 'loading'}
              onClick={deleteIssue}
              colorScheme="red"
            >
              Yes, delete
            </ActionButton>

            <ActionButton onClick={() => setIsDeleting(false)}>No</ActionButton>
          </ButtonGroup>
        </Flex>
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
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  setIsDeleting: PropTypes.func.isRequired
};

function EditIssueControls({ isEditing, setIsEditing, canDelete, issueId, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Flex w="full" justify="flex-end" align="center" wrap="wrap">
      {isEditing ? (
        <ButtonGroup>
          {canDelete && (
            <DeleteIssue
              issueId={issueId}
              onDelete={onDelete}
              isDeleting={isDeleting}
              setIsDeleting={setIsDeleting}
            />
          )}

          {!isDeleting && <ActionButton onClick={() => setIsEditing(false)}>Cancel</ActionButton>}
        </ButtonGroup>
      ) : (
        <ActionButton onClick={() => setIsEditing(true)}>Edit</ActionButton>
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
