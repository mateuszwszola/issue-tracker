import useMutation from '@/hooks/use-mutation';
import { Button, ButtonGroup, Flex, Text, useDisclosure, useToast } from '@chakra-ui/react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ProjectModal from '@/components/project/ProjectModal';
import UpdateProject from '@/components/project/UpdateProject';

function ManageProject({ projectId }) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteProject, deleteStatus] = useMutation('projects', {
    onSuccess: () => {
      Router.replace('/projects');
    },
    onError: (err) => {
      toast({
        title: 'An error occurred.',
        description: err.message || 'Unable to create a project',
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    }
  });
  const {
    isOpen: isUpdateProjectModalOpen,
    onOpen: openUpdateProjectModal,
    onClose: closeUpdateProjectModal
  } = useDisclosure();

  const handleSubmit = () => {
    setIsSubmitting(true);
  };

  const handleCancel = () => {
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!isSubmitting) return;

    await deleteProject(`projects/${projectId}`, { method: 'DELETE' });
  };

  return (
    <Flex w="full" justify="flex-end">
      <>
        {isSubmitting ? (
          <Flex direction="column" align="center">
            <Text mb={2}>Are you sure you want to delete this project?</Text>
            <ButtonGroup spacing="4" size="sm" variant="solid">
              <Button
                isLoading={deleteStatus === 'loading'}
                onClick={handleDelete}
                colorScheme="red"
              >
                Delete
              </Button>
              <Button isLoading={deleteStatus === 'loading'} onClick={handleCancel}>
                Cancel
              </Button>
            </ButtonGroup>
          </Flex>
        ) : (
          <ButtonGroup spacing="4" size="sm" variant="solid">
            <Button onClick={openUpdateProjectModal}>Edit</Button>

            <Button onClick={handleSubmit} colorScheme="red">
              Delete
            </Button>
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
