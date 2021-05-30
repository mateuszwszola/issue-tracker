import client from './api-client';
import { objToQueryString } from './query-string';

function getProjects(key, query) {
  return client(`${key}?${query}`);
}

function getProject(projectId) {
  const qs = objToQueryString({
    withGraph: '[type, createdBy, manager]'
  });

  return client(`projects/${projectId}?${qs}`);
}

function getProjectEngineers(projectId) {
  return client(`projects/${projectId}/engineers`);
}

function getProjectEngineer(projectId, userId) {
  return client(`projects/${projectId}/engineers/${userId}`);
}

function getProjectIdFromProjectKey(key) {
  return key.split('-').slice(-1)[0];
}

export {
  getProjects,
  getProject,
  getProjectIdFromProjectKey,
  getProjectEngineers,
  getProjectEngineer
};
