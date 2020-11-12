import client from './api-client';

function getProjects(url = 'projects') {
  return client(url);
}

export { getProjects };
