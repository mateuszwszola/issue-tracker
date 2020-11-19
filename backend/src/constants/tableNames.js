const tableNames = {
  user: 'User',
  project: 'Project',
  project_type: 'Project_type',
  project_engineer: 'Project_engineer',
  ticket: 'Ticket',
  ticket_type: 'Ticket_type',
  ticket_status: 'Ticket_status',
  ticket_priority: 'Ticket_priority',
  ticket_comment: 'Ticket_comment',
  epic: 'Epic',
  epic_ticket: 'epic_ticket',
  sprint: 'Sprint',
  sprint_ticket: 'Sprint_ticket',
  goal: 'Goal',
  attachment: 'Attachment',
};

export const orderedTableNames = [
  [
    tableNames.project_engineer,
    tableNames.ticket_comment,
    tableNames.attachment,
    tableNames.sprint_ticket,
    tableNames.epic_ticket,
  ],
  tableNames.sprint,
  tableNames.ticket,
  tableNames.project,
  tableNames.user,
  [
    tableNames.project_type,
    tableNames.ticket_type,
    tableNames.ticket_status,
    tableNames.ticket_priority,
    tableNames.goal,
    tableNames.epic,
  ],
];

export default tableNames;
