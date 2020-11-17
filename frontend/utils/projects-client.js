import client from './api-client';
import { objToQueryString } from './query-string';

const withGraphQueryString = objToQueryString({
  withGraph: '[type, manager, engineers]'
});

function getProjects(url = 'projects', query = withGraphQueryString) {
  return client(`${url}?${query}`);
}

function getProjectIdFromKey(key) {
  return key.split('-').slice(-1)[0];
}

export { getProjects, getProjectIdFromKey };
