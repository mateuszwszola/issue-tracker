import client from '@/utils/api-client';
import { getProject, getProjectEngineers } from '@/utils/projects-client';
import useSWR from 'swr';
import { useToast } from '@chakra-ui/react';
import useMutation from '@/hooks/use-mutation';

export function useProject(projectId) {
  const { data, error, ...swrData } = useSWR(['projects', projectId], () => getProject(projectId));

  return {
    isLoading: !data && !error,
    project: data?.project,
    error,
    ...swrData
  };
}

export function useProjectTypes() {
  const { data, error, ...swrData } = useSWR('projects/type', client);

  return {
    projectTypes: data?.types,
    isLoading: !data && !error,
    error,
    ...swrData
  };
}

export function useProjectEngineers(projectId) {
  const { data, error, ...swrData } = useSWR(['engineers', projectId], () =>
    getProjectEngineers(projectId)
  );

  return {
    isLoading: !error && !data,
    engineers: data?.engineers,
    error,
    ...swrData
  };
}

export function useAddProjectEngineer(projectId, config = {}) {
  const toast = useToast();

  const [addEngineer, addEngineerStatus] = useMutation(['engineers', projectId], {
    onSuccess: () => {
      toast({
        title: 'Engineer added.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      if (config.onSuccess) config.onSuccess();
    },
    onError: (err) => {
      toast({
        title: 'An error occurred.',
        description: err.message || 'Unable to add an engineer',
        status: 'error',
        duration: 5000,
        isClosable: true
      });

      if (config.onSuccess) config.onSuccess();
    }
  });

  const handleAddEngineer = async (userId) => {
    await addEngineer(`projects/${projectId}/engineers/${userId}`, { method: 'POST' });
  };

  return [handleAddEngineer, addEngineerStatus];
}

export function useRemoveProjectEngineer(projectId, config = {}) {
  const toast = useToast();

  const [removeEngineer, removeEngineerStatus] = useMutation(['engineers', projectId], {
    onSuccess: () => {
      toast({
        title: 'Engineer removed.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      if (config.onSuccess) config.onSuccess();
    },
    onError: (err) => {
      toast({
        title: 'An error occurred.',
        description: err.message || 'Unable to remove an engineer',
        status: 'error',
        duration: 5000,
        isClosable: true
      });

      if (config.onSuccess) config.onSuccess();
    }
  });

  const handleRemoveEngineer = async (userId) => {
    await removeEngineer(`projects/${projectId}/engineers/${userId}`, { method: 'DELETE' });
  };

  return [handleRemoveEngineer, removeEngineerStatus];
}

export function useCreateProject(config = {}) {
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

      if (config.onSuccess) config.onSuccess();
    },
    onError: (err) => {
      toast({
        title: 'An error occurred.',
        description: err.message || 'Unable to create a project',
        status: 'error',
        duration: 9000,
        isClosable: true
      });

      if (config.onError) config.onError();
    }
  });

  const onSubmit = async (data) => {
    await createProject('projects', { body: data });
  };

  return [onSubmit, createProjectStatus];
}

export function useUpdateProject(projectId, config = {}) {
  const toast = useToast();

  const [updateProject, updateProjectStatus] = useMutation(['projects', projectId], {
    onSuccess: () => {
      toast({
        title: 'Project updated.',
        description: "We've updated your project for you.",
        status: 'success',
        duration: 9000,
        isClosable: true
      });

      if (config.onSuccess) config.onSuccess();
    },
    onError: (err) => {
      toast({
        title: 'An error occurred.',
        description: err.message || 'Unable to update a project',
        status: 'error',
        duration: 9000,
        isClosable: true
      });

      if (config.onError) config.onError();
    }
  });

  const onSubmit = async (data) => {
    await updateProject(`projects/${projectId}`, { body: data, method: 'PATCH' });
  };

  return [onSubmit, updateProjectStatus];
}

export function useDeleteProject(projectId, config = {}) {
  const toast = useToast();

  const [deleteProject, deleteStatus] = useMutation('projects', {
    onSuccess: () => {
      toast({
        title: 'Project deleted.',
        description: "We've successfully deleted project.",
        status: 'success',
        duration: 9000,
        isClosable: true
      });

      if (config.onSuccess) config.onSuccess();
    },
    onError: (err) => {
      toast({
        title: 'An error occurred.',
        description: err.message || 'Unable to delete a project',
        status: 'error',
        duration: 9000,
        isClosable: true
      });

      if (config.onError) config.onError();
    }
  });

  const onSubmit = async () => {
    await deleteProject(`projects/${projectId}`, { method: 'DELETE' });
  };

  return [onSubmit, deleteStatus];
}
