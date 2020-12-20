import useMutation from '@/hooks/use-mutation';
import { Button, ButtonGroup, Flex, Text, useToast } from '@chakra-ui/react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { useState } from 'react';

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

  const handleSubmit = () => {
    setIsSubmitting(true);
  };

  const handleCancel = () => {
    setIsSubmitting(false);
  };

  const handleDelete = () => {
    if (!isSubmitting) return;

    deleteProject(`projects/${projectId}`, { method: 'DELETE' });
  };

  return (
    <Flex w="full" justify="flex-end">
      <>
        {isSubmitting ? (
          <Flex direction="column" align="center">
            <Text mb={2}>Are you sure you want to delete this project?</Text>
            <ButtonGroup spacing="6">
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
          <Button onClick={handleSubmit} colorScheme="red">
            Delete
          </Button>
        )}
      </>
    </Flex>
  );
}

ManageProject.propTypes = {
  projectId: PropTypes.string.isRequired
};

export default ManageProject;
