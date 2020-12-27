import { useDisclosure } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import { ActionButton } from '@/components/Button';
import PropTypes from 'prop-types';
import { useCreateTicket } from '@/hooks/use-ticket';
import IssueForm, { IssueFormModal } from '@/components/issue/IssueForm';

function CreateIssue({ projectId, refreshIssues }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [createIssue, createIssueStatus] = useCreateTicket({
    onSuccess: () => {
      onClose();
      refreshIssues();
    }
  });

  const onSubmit = (data) => {
    return createIssue({ ...data, project_id: projectId });
  };

  return (
    <>
      <ActionButton my={1} size="sm" colorScheme="blue" leftIcon={<FaPlus />} onClick={onOpen}>
        Add issue
      </ActionButton>

      <IssueFormModal isOpen={isOpen} onClose={onClose}>
        <IssueForm onSubmit={onSubmit} submitStatus={createIssueStatus} projectId={projectId} />
      </IssueFormModal>
    </>
  );
}

CreateIssue.propTypes = {
  projectId: PropTypes.number.isRequired,
  refreshIssues: PropTypes.func.isRequired
};

export default CreateIssue;
