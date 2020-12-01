import client from './api-client';

function getTickets(key) {
  return client(key);
}

export { getTickets };
