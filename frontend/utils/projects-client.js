import client, { API_URL } from './api-client';

function getProjects(query = '') {
  return client(`${API_URL}/projects?${encodeURIComponent(query)}`);
}

export { getProjects };
