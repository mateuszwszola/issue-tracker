import client from './api-client';

function getProjects(key) {
  return client(key);
}

function getProject(key) {
  return client(key);
}

function getProjectIdFromProjectKey(key) {
  return key.split('-').slice(-1)[0];
}

export { getProjects, getProject, getProjectIdFromProjectKey };
