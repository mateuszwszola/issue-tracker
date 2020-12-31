import { useDisclosure } from '@chakra-ui/react';
import { useCreateProject } from '@/hooks/use-project';
import { FaPlus } from 'react-icons/fa';
import ProjectForm, { ProjectModal } from '@/components/project/ProjectForm';
import { ActionButton } from '@/components/Button';

function CreateProject({ ...chakraProps }) {
  const {
    isOpen: isCreateProjectModalOpen,
    onOpen: openCreateProjectModal,
    onClose: closeCreateProjectModal
  } = useDisclosure();

  const [createProject, createProjectStatus] = useCreateProject({
    onSuccess: () => closeCreateProjectModal()
  });

  return (
    <>
      <ActionButton
        {...chakraProps}
        size="sm"
        colorScheme="blue"
        leftIcon={<FaPlus />}
        onClick={openCreateProjectModal}
      >
        Create project
      </ActionButton>

      <ProjectModal isOpen={isCreateProjectModalOpen} onClose={closeCreateProjectModal}>
        <ProjectForm onSubmit={createProject} status={createProjectStatus} />
      </ProjectModal>
    </>
  );
}

export default CreateProject;
