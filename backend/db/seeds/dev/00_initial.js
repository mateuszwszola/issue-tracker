import 'dotenv/config';
import tableNames from '../../../src/constants/tableNames';
import { projectTypes } from '../../../src/constants/project';
import {
  ticketTypes,
  ticketStatuses,
  ticketPriorities,
} from '../../../src/constants/ticket';
import {
  getProjectData,
  getTicketData,
  getUserData,
} from '../../../src/fixtures/data';
import '../../../src/db';
import { User } from '../../../src/api/user/user.model';
import { Project } from '../../../src/api/project/project.model';
import { Ticket } from '../../../src/api/ticket/ticket.model';

export async function seed(knex) {
  await Promise.all(
    Object.values(tableNames).map((tableName) => knex(tableName).del())
  );

  const [
    projectTypeResults,
    ticketTypeResults,
    ticketStatusResults,
    ticketPriorityResults,
  ] = await Promise.all([
    knex(tableNames.project_type).insert(projectTypes).returning('*'),
    knex(tableNames.ticket_type).insert(ticketTypes).returning('*'),
    knex(tableNames.ticket_status).insert(ticketStatuses).returning('*'),
    knex(tableNames.ticket_priority).insert(ticketPriorities).returning('*'),
  ]);

  const userData = getUserData();
  const user = await User.query().insert(userData);

  const projectsData = Array(10)
    .fill(null)
    .map((_, i) => ({
      ...getProjectData({
        managerId: user.id,
        typeId: projectTypeResults[0].id,
      }),
    }));

  const projects = await Project.query().insert(projectsData);

  const ticketsData = Array(100)
    .fill(null)
    .map((_, i) => ({
      ...getTicketData({ reporterId: user.id }),
      project_id: projects[i % projectsData.length].id,
      type_id: ticketTypeResults[0].id,
      status_id: ticketStatusResults[0].id,
      priority_id: ticketPriorityResults[0].id,
    }));

  await Ticket.query().insert(ticketsData);
}
