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
  p1: 'P1',
  p2: 'P2',
  p3: 'P3',
  p4: 'P4',
  p5: 'P5',
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

export {
  TICKET_TYPES,
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  ticketTypes,
  ticketStatuses,
  ticketPriorities,
};
