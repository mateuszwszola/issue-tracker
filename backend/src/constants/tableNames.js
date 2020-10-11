const tableNames = {
  user: 'User',
  role: 'Role',
  project: 'Project',
  project_type: 'Project_type',
  project_status: 'Project_status',
  project_engineer: 'Project_engineer',
  ticket: 'Ticket',
  sub_ticket: 'Sub_ticket',
  ticket_type: 'Ticket_type',
  ticket_status: 'Ticket_status',
  ticket_priority: 'Ticket_priority',
  ticket_comment: 'Ticket_comment',
  ticket_engineer: 'Ticket_engineer',
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
    tableNames.ticket_engineer,
    tableNames.sub_ticket,
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
    tableNames.role,
    tableNames.project_type,
    tableNames.project_status,
    tableNames.ticket_type,
    tableNames.ticket_status,
    tableNames.ticket_priority,
    tableNames.goal,
    tableNames.epic,
  ],
];

export default tableNames;
