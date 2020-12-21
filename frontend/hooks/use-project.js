import client from '@/utils/api-client';
import { getProject } from '@/utils/projects-client';
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
