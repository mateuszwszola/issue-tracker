import { ButtonGroup, Flex, Text, useDisclosure } from '@chakra-ui/react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { ProjectModal } from '@/components/project/ProjectForm';
import UpdateProject from '@/components/project/UpdateProject';
import { useDeleteProject } from '@/hooks/use-project';
import { ActionButton } from '../Button';

function ManageProject({ projectId }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteProject, deleteStatus] = useDeleteProject(projectId, {
    onSuccess: () => Router.replace('/projects')
  });

  const {
    isOpen: isUpdateProjectModalOpen,
    onOpen: openUpdateProjectModal,
    onClose: closeUpdateProjectModal
  } = useDisclosure();

  const handleDeleteStart = () => {
    setIsDeleting(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
  };

  const handleDelete = async () => {
    if (!isDeleting) return;

    await deleteProject();
  };

  return (
    <Flex w="full" justify="flex-end">
      <>
        {isDeleting ? (
          <Flex direction="column" align="center">
            <Text mb={2}>Are you sure you want to delete this project?</Text>
            <ButtonGroup spacing="4" size="sm" variant="solid">
              <ActionButton
                isLoading={deleteStatus === 'loading'}
                onClick={handleDelete}
                colorScheme="red"
              >
                Delete
              </ActionButton>
              <ActionButton isLoading={deleteStatus === 'loading'} onClick={handleDeleteCancel}>
                Cancel
              </ActionButton>
            </ButtonGroup>
          </Flex>
        ) : (
          <ButtonGroup spacing="4" size="sm" variant="solid">
            <ActionButton onClick={openUpdateProjectModal}>Edit</ActionButton>

            <ActionButton onClick={handleDeleteStart} colorScheme="red">
              Delete
            </ActionButton>
          </ButtonGroup>
        )}

        <ProjectModal isOpen={isUpdateProjectModalOpen} onClose={closeUpdateProjectModal}>
          <UpdateProject onClose={closeUpdateProjectModal} projectId={projectId} />
        </ProjectModal>
      </>
    </Flex>
  );
}

ManageProject.propTypes = {
  projectId: PropTypes.string
};

export default ManageProject;
