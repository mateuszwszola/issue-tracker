import client from './api-client';
import { objToQueryString } from './query-string';

export function getTickets(key) {
  return client(key);
}

const ticketQueryString = objToQueryString({
  withGraph:
    '[type, status, priority, assignee, createdBy, updatedBy, comments, project, subTicket]'
});

export function getTicket(ticketId) {
  return client(`tickets/${ticketId}?${ticketQueryString}`);
}
