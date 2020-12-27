import { useDisclosure } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import { ActionButton } from '@/components/Button';
import PropTypes from 'prop-types';
import { useCreateIssue } from '@/hooks/use-ticket';
import IssueForm, { IssueFormModal } from '@/components/issue/IssueForm';

function CreateIssue({ projectId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [createIssue, createIssueStatus] = useCreateIssue({
    onSuccess: () => onClose()
  });

  return (
    <>
      <ActionButton my={1} size="sm" colorScheme="blue" leftIcon={<FaPlus />} onClick={onOpen}>
        Create issue
      </ActionButton>

      <IssueFormModal isOpen={isOpen} onClose={onClose}>
        <IssueForm onSubmit={createIssue} status={createIssueStatus} projectId={projectId} />
      </IssueFormModal>
    </>
  );
}

CreateIssue.propTypes = {
  projectId: PropTypes.number.isRequired
};

export default CreateIssue;
