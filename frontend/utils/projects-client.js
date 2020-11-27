import client from './api-client';
import { objToQueryString } from './query-string';

const defaultProjectGraphQueryString = objToQueryString({
  withGraph: '[type, manager, engineers, createdBy]'
});

function getProjects(key) {
  return client(`${key}&${defaultProjectGraphQueryString}`);
}

function getProjectIdFromKey(key) {
  return key.split('-').slice(-1)[0];
}

export { getProjects, getProjectIdFromKey };
