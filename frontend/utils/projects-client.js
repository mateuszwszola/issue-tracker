import client from './api-client';
import { objToQueryString } from './query-string';

const withGraphQueryString = objToQueryString({
  withGraph: '[type, manager]'
});

function getProjects(url = 'projects', query = withGraphQueryString) {
  return client(`${url}?${query}`);
}

export { getProjects };
