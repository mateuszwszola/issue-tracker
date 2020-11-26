import client from './api-client';
import { objToQueryString } from './query-string';

const defaultProjectGraphQueryString = objToQueryString({
  withGraph: '[type, manager, engineers, createdBy]'
});

function getProjects(url = 'projects', query = defaultProjectGraphQueryString) {
  return client(`${url}?${query}`);
}

function getProjectIdFromKey(key) {
  return key.split('-').slice(-1)[0];
}

export { getProjects, getProjectIdFromKey };
