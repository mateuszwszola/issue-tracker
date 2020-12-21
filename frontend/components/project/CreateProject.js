import useMutation from '@/hooks/use-mutation';
import { useToast } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import ProjectForm from '@/components/project/ProjectForm';

const CreateProject = ({ onClose }) => {
  const toast = useToast();
  const [createProject, createProjectStatus] = useMutation('projects', {
    onSuccess: () => {
      toast({
        title: 'Project created.',
        description: "We've created your project for you.",
        status: 'success',
        duration: 9000,
        isClosable: true
      });

      onClose();
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

  const onSubmit = async (data) => {
    await createProject('projects', { body: data });
  };

  return <ProjectForm onSubmit={onSubmit} status={createProjectStatus} />;
};

CreateProject.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default CreateProject;
