import client from './api-client';
import { getProjectIdFromKey } from './projects-client';

function getProjectTickets(projectKey) {
  const projectId = encodeURIComponent(getProjectIdFromKey(projectKey));
  return client(`tickets?projectId=${projectId}`);
}

export { getProjectTickets };
