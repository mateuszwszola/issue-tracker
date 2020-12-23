import { Button, useDisclosure } from '@chakra-ui/react';
import { useCreateProject } from '@/hooks/use-project';
import { FaPlus } from 'react-icons/fa';
import ProjectForm, { ProjectModal } from '@/components/project/ProjectForm';

function CreateProject() {
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
      <Button
        my={1}
        size="sm"
        colorScheme="blue"
        leftIcon={<FaPlus />}
        onClick={openCreateProjectModal}
      >
        Create project
      </Button>

      <ProjectModal isOpen={isCreateProjectModalOpen} onClose={closeCreateProjectModal}>
        <ProjectForm onSubmit={createProject} status={createProjectStatus} />
      </ProjectModal>
    </>
  );
}

export default CreateProject;
