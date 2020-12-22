import client from '@/utils/api-client';
import { getProject, getProjectEngineers } from '@/utils/projects-client';
import useSWR from 'swr';

export function useProjectTypes() {
  const { data, error, ...swrData } = useSWR('projects/type', client);

  return {
    projectTypes: data?.types,
    isLoading: !data && !error,
    error,
    ...swrData
  };
}

export function useProject(projectId) {
  const { data, error, ...swrData } = useSWR(['projects', projectId], () => getProject(projectId));

  return {
    isLoading: !data && !error,
    project: data?.project,
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
