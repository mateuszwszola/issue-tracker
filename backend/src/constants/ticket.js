const TICKET_TYPES = {
  bug: 'Bug',
  task: 'Task',
  feature: 'Feature Request',
  epic: 'Epic',
};

const TICKET_STATUSES = {
  todo: 'To Do',
  in_progress: 'In Progress',
  under_review: 'Under Review',
  done: 'Done',
};

const TICKET_PRIORITIES = {
  p1: 'Critical',
  p2: 'Major',
  p3: 'Normal',
};

const ticketTypes = Object.values(TICKET_TYPES).map((name) => ({
  name,
}));

const ticketStatuses = Object.values(TICKET_STATUSES).map((name) => ({
  name,
}));

const ticketPriorities = Object.values(TICKET_PRIORITIES).map((name) => ({
  name,
}));

const validTicketOrders = new Set([
  'id',
  'project_id',
  'key',
  'name',
  'type_id',
  'status_id',
  'priority_id',
  'reporter_id',
]);

export {
  TICKET_TYPES,
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  ticketTypes,
  ticketStatuses,
  ticketPriorities,
  validTicketOrders,
};
