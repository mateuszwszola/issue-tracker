import supertest from 'supertest';
import { app } from '../../../app';
import db from '../../../db';
import setupTest from '../../../setupTests';
import teardownTest from '../../../teardownTests';
import {
  getProjectData,
  getTicketData,
  getUserData,
} from '../../../utils/testUtils';
import { Project } from '../project.model';
import { User } from '../../user/user.model';
import { Ticket } from '../../ticket/ticket.model';
import { getToken } from '../../../utils/fixtures';

const BASE_PATH = '/api/v1/projects';

describe('Test project engineers endpoints', () => {
  const thisDb = db;
  const ProjectModel = Project;
  const UserModel = User;
  const TicketModel = Ticket;

  beforeAll(() => setupTest(thisDb));

  afterAll(() => teardownTest(thisDb));

  afterEach(async () => {
    await TicketModel.query().delete();
    await ProjectModel.query().delete();
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

      const ticketData = getTicketData({ reporterId: user.id });

      const token = getToken({ sub: 'auth0|123' });

      const response = await supertest(app)
        .post(`${BASE_PATH}/${project.id}/tickets`)
        .send(ticketData)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
    });
  });
});
