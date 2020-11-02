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

describe('Test the ticket endpoints', () => {
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

  describe('GET /api/v1/tickets', () => {
    it('should respond with an array of tickets', async () => {
      const reporter = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await TicketModel.query().insert(
        getTicketData({ projectId: project.id, reporterId: reporter.id })
      );

      const response = await supertest(app).get(BASE_PATH);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('tickets');
      expect(response.body.tickets.length).toBe(1);
      expect(response.body.tickets[0].id).toBe(ticket.id);
    });
  });

  describe('GET /api/v1/tickets/:ticketId', () => {
    it('should respond with 404 - not ticket found', async () => {
      const response = await supertest(app).get(`${BASE_PATH}/100`);

      expect(response.statusCode).toBe(404);
    });

    it('should respond with a ticket', async () => {
      const reporter = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await TicketModel.query().insert(
        getTicketData({
          projectId: project.id,
          reporterId: reporter.id,
        })
      );

      const response = await supertest(app).get(`${BASE_PATH}/${ticket.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('ticket');
      expect(response.body.ticket.id).toBe(ticket.id);
    });
  });

  describe('POST /api/v1/tickets', () => {
    it('should fail without token', async () => {
      const response = await supertest(app).post(BASE_PATH);

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user not authorized', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123' })
      );
      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .post(BASE_PATH)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should create and respond with a ticket', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123', isAdmin: true })
      );
      const project = await ProjectModel.query().insert(getProjectData());

      const ticketData = getTicketData({
        projectId: project.id,
        reporterId: user.id,
      });

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .post(BASE_PATH)
        .send(ticketData)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('ticket');
      expect(response.body.ticket.project_id).toBe(ticketData.project_id);
      expect(response.body.ticket.reporter_id).toBe(ticketData.reporter_id);
      expect(response.body.ticket.key).toBe(ticketData.key);
      expect(response.body.ticket.name).toBe(ticketData.name);
      expect(response.body.ticket.description).toBe(ticketData.description);
      expect(response.body.ticket).toHaveProperty('type_id');
      expect(response.body.ticket).toHaveProperty('status_id');
      expect(response.body.ticket).toHaveProperty('priority_id');
    });
  });

  describe('PATCH /api/v1/tickets/:ticketId', () => {
    it('should fail without token', async () => {
      const reporter = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await TicketModel.query().insert(
        getTicketData({
          projectId: project.id,
          reporterId: reporter.id,
        })
      );

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${ticket.id}`)
        .send({ name: 'New ticket name' });

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123' })
      );
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await TicketModel.query().insert(
        getTicketData({
          projectId: project.id,
          reporterId: user.id,
        })
      );

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${ticket.id}`)
        .send({ name: 'New ticket name' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should respond with 404 - ticket not found', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123', isAdmin: true })
      );

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .patch(`${BASE_PATH}/10`)
        .send({ name: 'New Name' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });

    it('should update and respond with an updated ticket', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123', isAdmin: true })
      );
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await TicketModel.query().insert(
        getTicketData({
          projectId: project.id,
          reporterId: user.id,
        })
      );

      const token = getToken({ sub: user.sub });

      const newTicketData = pick(getTicketData(), ['name', 'description']);

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${ticket.id}`)
        .send(newTicketData)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('ticket');
      expect(response.body.ticket.id).toBe(ticket.id);
      expect(response.body.ticket.name).toBe(newTicketData.name);
      expect(response.body.ticket.description).toBe(newTicketData.description);
      expect(response.body.ticket.project_id).toBe(ticket.project_id);
      expect(response.body.ticket.reporter_id).toBe(ticket.reporter_id);
    });
  });

  // describe('');
});
