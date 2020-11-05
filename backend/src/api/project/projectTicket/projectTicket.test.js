import supertest from 'supertest';
import { pick } from 'lodash';
import { app } from '../../../app';
import db from '../../../db';
import setupTest from '../../../setupTests';
import teardownTest from '../../../teardownTests';
import { Project } from '../project.model';
import { User } from '../../user/user.model';
import { Ticket } from '../../ticket/ticket.model';
import { getToken } from '../../../fixtures/jwt';
import {
  getProjectData,
  getTicketData,
  getUserData,
} from '../../../fixtures/data';

const BASE_PATH = '/api/v1/projects';

describe('Test projectTicket endpoints', () => {
  const thisDb = db;
  const UserModel = User;
  const ProjectModel = Project;
  const TicketModel = Ticket;

  beforeAll(() => setupTest(thisDb));

  afterAll(() => teardownTest(thisDb));

  afterEach(async () => {
    await ProjectModel.query().delete();
    await TicketModel.query().delete();
    await UserModel.query().delete();
  });

  describe('GET /api/v1/projects/:projectId/tickets', () => {
    it('should respond with an array of tickets', async () => {
      const reporter = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());

      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData({ reporterId: reporter.id }));

      const response = await supertest(app).get(
        `${BASE_PATH}/${project.id}/tickets`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('tickets');
      expect(response.body.tickets.length).toBe(1);
      expect(response.body.tickets[0].id).toBe(ticket.id);
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

      const token = getToken({ sub: 'auth0|123' });

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
      expect(response.body.ticket).toHaveProperty('key');
      // expect(response.body.ticket).not.toBe()
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
      expect(response.body.ticket.name).toBe(newTicketData.name);
      expect(response.body.ticket.description).toBe(newTicketData.description);
      expect(response.body.ticket.type_id).toBe(newTicketData.type_id);
      expect(response.body.ticket.status_id).toBe(newTicketData.status_id);
      expect(response.body.ticket.priority_id).toBe(newTicketData.priority_id);
    });
  });
});
