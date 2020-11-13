import supertest from 'supertest';
import { pick } from 'lodash';
import { app } from '../../app';
import db from '../../db';
import setupTest from '../../setupTests';
import teardownTest from '../../teardownTests';
import { User } from '../user/user.model';
import { Ticket } from './ticket.model';
import { Project } from '../project/project.model';
import { getToken } from '../../fixtures/jwt';
import {
  getProjectData,
  getTicketData,
  getUserData,
} from '../../fixtures/data';

const BASE_PATH = '/api/v1/tickets';

describe('Test ticket endpoints', () => {
  const thisDb = db;
  const UserModel = User;
  const ProjectModel = Project;
  const TicketModel = Ticket;

  beforeAll(() => setupTest(thisDb));

  afterAll(() => teardownTest(thisDb));

  afterEach(async () => {
    await TicketModel.query().delete();
    await ProjectModel.query().delete();
    await UserModel.query().delete();
  });

  describe('GET /api/v1/tickets?projectId=', () => {
    it('should respond with error for invalid query param', async () => {
      const response = await supertest(app).get(`${BASE_PATH}?orderBy=invalid`);

      expect(response.statusCode).toBe(400);
    });

    it('should respond with an error if project not found', async () => {
      const response = await supertest(app).get(`${BASE_PATH}?projectId=123`);

      expect(response.statusCode).toBe(404);
    });

    it('should respond with an array of tickets', async () => {
      const reporter = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());

      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData({ reporterId: reporter.id }));

      const response = await supertest(app).get(`${BASE_PATH}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('tickets');
      expect(response.body.tickets.length).toBe(1);
      expect(response.body.tickets[0].id).toBe(ticket.id);
      expect(response.body.tickets[0].project_id).toBe(project.id);
      expect(response.body.tickets[0].reporter_id).toBe(reporter.id);
    });

    it('should respond with an array of project tickets', async () => {
      const reporter = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());

      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData({ reporterId: reporter.id }));

      const response = await supertest(app).get(
        `${BASE_PATH}?projectId=${project.id}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('tickets');
      expect(response.body.tickets.length).toBe(1);
      expect(response.body.tickets[0].id).toBe(ticket.id);
      expect(response.body.tickets[0].project_id).toBe(project.id);
      expect(response.body.tickets[0].reporter_id).toBe(reporter.id);
    });

    it('should respond with an array of project tickets withGraphFetched', async () => {
      const reporter = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());

      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData({ reporterId: reporter.id }));

      const response = await supertest(app).get(
        `${BASE_PATH}?projectId=${project.id}&withGraph=[project,type(defaultSelects),status(defaultSelects),priority(defaultSelects),reporter,parentTicket]`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('tickets');
      expect(response.body.tickets.length).toBe(1);
      expect(response.body.tickets[0].id).toBe(ticket.id);
      expect(response.body.tickets[0].project.name).toBe(project.name);
      expect(response.body.tickets[0].type).toHaveProperty('name');
      expect(response.body.tickets[0].status).toHaveProperty('name');
      expect(response.body.tickets[0].priority).toHaveProperty('name');
      expect(response.body.tickets[0].reporter).toHaveProperty('name');
    });
  });

  describe('GET /api/v1/projects/:projectId/tickets/:ticketId', () => {
    it('should respond with 404 - ticket not found', async () => {
      const response = await supertest(app).get(`${BASE_PATH}/100/tickets/100`);

      expect(response.statusCode).toBe(404);
    });

    it('should respond with a ticket', async () => {
      const reporter = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(
          getTicketData({
            reporterId: reporter.id,
          })
        );

      const response = await supertest(app).get(
        `${BASE_PATH}/${project.id}/tickets/${ticket.id}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('ticket');
      expect(response.body.ticket.id).toBe(ticket.id);
      expect(response.body.ticket.project_id).toBe(project.id);
      expect(response.body.ticket.key).toBeTruthy();
      expect(response.body.ticket.name).toBe(ticket.name);
    });
  });

  describe('POST /api/v1/projects/:projectId/tickets', () => {
    it('should fail without token', async () => {
      const reporter = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());

      const ticketData = getTicketData({ reporterId: reporter.id });

      const response = await supertest(app)
        .post(`${BASE_PATH}/${project.id}/tickets`)
        .send(ticketData);

      expect(response.statusCode).toBe(401);
    });

    it('should fail if auth user is not a project engineer', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123' })
      );
      const project = await ProjectModel.query().insert(getProjectData());

      const ticketData = getTicketData({ reporterId: user.id });

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .post(`${BASE_PATH}/${project.id}/tickets`)
        .send(ticketData)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should add and respond with a ticket', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123' })
      );
      const project = await ProjectModel.query().insert(getProjectData());
      await ProjectModel.relatedQuery('engineers')
        .for(project.id)
        .relate(user.id);

      const ticketData = getTicketData();

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .post(`${BASE_PATH}/${project.id}/tickets`)
        .send(ticketData)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('ticket');
      expect(response.body.ticket.project_id).toBe(project.id);
      expect(response.body.ticket.key).toBeTruthy();
      expect(response.body.ticket.name).toBe(ticketData.name);
      expect(response.body.ticket.description).toBe(ticketData.description);
      expect(response.body.ticket.type_id).toBe(ticketData.type_id);
      expect(response.body.ticket.status_id).toBe(ticketData.status_id);
      expect(response.body.ticket.priority_id).toBe(ticketData.priority_id);
    });
  });

  describe('PATCH /api/v1/projects/:projectId/tickets/:ticketId', () => {
    it('should fail without token', async () => {
      const reporter = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData({ reporterId: reporter.id }));

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${project.id}/tickets/${ticket.id}`)
        .send({ name: 'New name' });

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123' })
      );
      const reporter = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData({ reporterId: reporter.id }));

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${project.id}/tickets/${ticket.id}`)
        .send({ name: 'New name' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should update and respond with updated ticket', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123' })
      );
      const reporter = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());
      await ProjectModel.relatedQuery('engineers')
        .for(project.id)
        .relate(user.id);

      const ticketData = getTicketData({ reporterId: reporter.id });

      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(ticketData);

      const newTicketData = pick(
        getTicketData({ typeId: 2, statusId: 2, priorityId: 2 }),
        ['name', 'description', 'type_id', 'status_id', 'priority_id']
      );

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${project.id}/tickets/${ticket.id}`)
        .send(newTicketData)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('ticket');
      expect(response.body.ticket.project_id).toBe(project.id);
      expect(response.body.ticket.reporter_id).toBe(reporter.id);
      expect(response.body.ticket.key).toBeTruthy();
      expect(response.body.ticket.name).toBe(newTicketData.name);
      expect(response.body.ticket.description).toBe(newTicketData.description);
      expect(response.body.ticket.type_id).toBe(newTicketData.type_id);
      expect(response.body.ticket.status_id).toBe(newTicketData.status_id);
      expect(response.body.ticket.priority_id).toBe(newTicketData.priority_id);
    });
  });

  describe('DELETE /api/v1/projects/:projectId/tickets/:ticketId', () => {
    it('should fail without a token', async () => {
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(
          getTicketData({
            reporterId: user.id,
          })
        );

      const response = await supertest(app).delete(
        `${BASE_PATH}/${project.id}/tickets/${ticket.id}`
      );

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123' })
      );
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(
          getTicketData({
            reporterId: user.id,
          })
        );

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .delete(`${BASE_PATH}/${project.id}/tickets/${ticket.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should respond with 404 - ticket not found', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123', isAdmin: true })
      );

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .delete(`${BASE_PATH}/100/tickets/100`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });

    it('should remove and respond with a removed ticket', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123', isAdmin: true })
      );
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(
          getTicketData({
            reporterId: user.id,
          })
        );

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .delete(`${BASE_PATH}/${project.id}/tickets/${ticket.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('ticket');
      expect(response.body.ticket.id).toBe(ticket.id);
      expect(response.body.ticket.name).toBe(ticket.name);
      expect(response.body.archived_at).not.toBe(null);
    });
  });
});
