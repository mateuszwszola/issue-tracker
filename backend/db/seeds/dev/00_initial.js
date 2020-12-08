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
import * as faker from 'faker';

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

  const [admin, manager, engineer1, engineer2, submitter] = await Promise.all([
    User.query().insert(getUserData({ isAdmin: true })),
    User.query().insert(getUserData()),
    User.query().insert(getUserData()),
    User.query().insert(getUserData()),
    User.query().insert(getUserData()),
  ]);

  const projectsData = Array(10)
    .fill(null)
    .map(() => ({
      ...getProjectData({
        managerId: manager.id,
        createdBy: admin.id,
        typeId:
          projectTypeResults[
            Math.floor(Math.random() * projectTypeResults.length)
          ].id,
      }),
    }));

  const projects = await Project.query().insert(projectsData);

  // Add projects engineer
  projects.forEach(async (project) => {
    await Promise.all([
      Project.relatedQuery('engineers').for(project.id).relate(engineer1.id),
      Project.relatedQuery('engineers').for(project.id).relate(engineer2.id),
    ]);
  });

  const ticketsData = Array(100)
    .fill(null)
    .map((_, idx) => ({
      ...getTicketData({
        createdBy: submitter.id,
        updatedBy: engineer1.id,
        assigneeId: engineer1.id,
        projectId: parseInt(projects[idx % projectsData.length].id),
        typeId:
          ticketTypeResults[
            Math.floor(Math.random() * ticketTypeResults.length)
          ].id,
        statusId:
          ticketStatusResults[
            Math.floor(Math.random() * ticketStatusResults.length)
          ].id,
        priorityId:
          ticketPriorityResults[
            Math.floor(Math.random() * ticketPriorityResults.length)
          ].id,
      }),
    }));

  const tickets = await Ticket.query().insert(ticketsData);

  tickets.forEach(async (ticket) => {
    await Ticket.relatedQuery('comments')
      .for(ticket.id)
      .insert({ user_id: engineer2.id, comment: faker.lorem.sentences(3) });
  });
}
