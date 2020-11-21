const TICKET_TYPES = {
  bug: 'Bug',
  task: 'Task',
  feature: 'Feature',
};

const TICKET_STATUSES = {
  submitted: 'Submitted',
  open: 'Open',
  in_progress: 'In Progress',
  fixed: 'Fixed',
  closed: 'Closed',
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
