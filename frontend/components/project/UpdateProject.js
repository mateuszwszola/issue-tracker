import PropTypes from 'prop-types';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import ProjectForm from './ProjectForm';
import { useProject, useUpdateProject } from '@/hooks/use-project';

const UpdateProject = ({ onClose, projectId }) => {
  const { error, project } = useProject(projectId);

  const [onSubmit, updateProjectStatus] = useUpdateProject(projectId, {
    onSuccess: onClose
  });

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
