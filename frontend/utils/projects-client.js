import client from './api-client';
import { objToQueryString } from './query-string';

const withGraphQueryString = objToQueryString({
  withGraph: '[type, manager]'
});

function getProjects(url = 'projects', query = withGraphQueryString) {
  return client(`${url}?${query}`);
}

const getProjectIdFromKey = (key) => {
  const [projectId] = key.split('-').slice(-1);
  return projectId;
};

function getProjectTickets(projectKey) {
  return client(`projects/${encodeURIComponent(getProjectIdFromKey(projectKey))}/tickets`);
}

export { getProjects, getProjectTickets };
