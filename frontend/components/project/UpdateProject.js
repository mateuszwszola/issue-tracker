import PropTypes from 'prop-types';
import { Spinner, useToast, Text, Flex } from '@chakra-ui/react';
import useMutation from '@/hooks/use-mutation';
import ProjectForm from './ProjectForm';
import { useProject } from '@/hooks/use-project';

const UpdateProject = ({ onClose, projectId }) => {
  const toast = useToast();
  const { error, project } = useProject(projectId);

  const [updateProject, updateProjectStatus] = useMutation(['projects', projectId], {
    onSuccess: () => {
      toast({
        title: 'Project updated.',
        description: "We've updated your project for you.",
        status: 'success',
        duration: 9000,
        isClosable: true
      });

      onClose();
    },
    onError: (err) => {
      toast({
        title: 'An error occurred.',
        description: err.message || 'Unable to update a project',
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    }
  });

  const onSubmit = async (data) => {
    await updateProject(`projects/${projectId}`, { body: data, method: 'PATCH' });
  };

  return (
    <>
      {error ? (
        <Text textAlign="center">Unable to fetch a project</Text>
      ) : !project ? (
        <Flex w="full" h="full" justify="center" align="center">
          <Spinner size="md" />
        </Flex>
      ) : (
        <ProjectForm
          onSubmit={onSubmit}
          status={updateProjectStatus}
          initialNameValue={project.name || ''}
          initialDescValue={project.description || ''}
          initialTypeId={project.type_id}
          initialManagerId={project.manager_id}
        />
      )}
    </>
  );
};

UpdateProject.propTypes = {
  onClose: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired
};

export default UpdateProject;
