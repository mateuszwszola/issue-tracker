import client from './api-client';
import { getProjectIdFromKey } from './projects-client';
import { objToQueryString } from './query-string';

const withGraphQueryString = objToQueryString({
  withGraph: '[type, status, priority, createdBy]'
});

function getProjectTickets(projectKey) {
  const projectId = encodeURIComponent(getProjectIdFromKey(projectKey));
  return client(`tickets?projectId=${projectId}&${withGraphQueryString}`);
}

export { getProjectTickets };
