import request from 'supertest';
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

const BASE_PATH = '/api/tickets';

describe('Test a ticket endpoints', () => {
  const thisDb = db;
  const UserModel = User;
  const ProjectModel = Project;
  const TicketModel = Ticket;

  beforeAll(() => setupTest(thisDb));

  afterAll(() => teardownTest(thisDb));

  let admin, project;

  beforeEach(async () => {
    admin = await UserModel.query().insert(getUserData({ isAdmin: true }));
    project = await ProjectModel.query().insert(
      getProjectData({ createdBy: admin.id })
    );
  });

  afterEach(async () => {
    await TicketModel.query().delete();
    await ProjectModel.query().delete();
    await UserModel.query().delete();
  });

  describe('GET /api/tickets?projectId=', () => {
    let ticket;

    beforeEach(async () => {
      ticket = await TicketModel.query().insert(
        getTicketData({ projectId: project.id, createdBy: admin.id })
      );
    });

    it('should respond with an error if invalid query param provided', async () => {
      const response = await request(app).get(`${BASE_PATH}?orderBy=invalid`);

      expect(response.statusCode).toBe(400);
    });

    it('should respond with an error if project not found', async () => {
      const response = await request(app).get(`${BASE_PATH}?projectId=123`);

      expect(response.statusCode).toBe(404);
    });

    it('should respond with an array of tickets', async () => {
      const response = await request(app).get(`${BASE_PATH}`);

      const { statusCode, body } = response;

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('tickets');
      expect(body.tickets.length).toBe(1);

      const [responseTicket] = body.tickets;

      expect(responseTicket.id).toBe(ticket.id);
      expect(responseTicket.project_id).toBe(project.id);
      expect(responseTicket.created_by).toBe(admin.id);
    });

    it('should respond with an array of project tickets', async () => {
      const response = await request(app).get(
        `${BASE_PATH}?projectId=${project.id}`
      );

      const { statusCode, body } = response;

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('tickets');
      expect(body.tickets.length).toBe(1);

      const [responseTicket] = body.tickets;

      expect(responseTicket.id).toBe(ticket.id);
      expect(responseTicket.project_id).toBe(project.id);
      expect(responseTicket.created_by).toBe(admin.id);
    });

    it('should respond with an array of project tickets withGraphFetched', async () => {
      const response = await request(app).get(
        `${BASE_PATH}?projectId=${project.id}&withGraph=[project,type,status,priority,createdBy]`
      );

      const { statusCode, body } = response;

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('tickets');
      expect(body.tickets.length).toBe(1);

      const [responseTicket] = body.tickets;

      expect(responseTicket.id).toBe(ticket.id);
      expect(responseTicket.project.name).toBe(project.name);
      expect(responseTicket.createdBy.email).toBe(admin.email);

      ['type', 'status', 'priority'].forEach((property) => {
        expect(responseTicket[property]).toHaveProperty('name');
      });
    });
  });

  describe('GET /api/tickets/:ticketId', () => {
    let ticket;

    beforeEach(async () => {
      ticket = await TicketModel.query().insert(
        getTicketData({
          projectId: project.id,
          createdBy: admin.id,
        })
      );
    });

    it('should respond with 404 error if ticket does not exists', async () => {
      const response = await request(app).get(`${BASE_PATH}/100`);

      expect(response.statusCode).toBe(404);
    });

    it('should respond with a ticket', async () => {
      const response = await request(app).get(`${BASE_PATH}/${ticket.id}`);

      const { statusCode, body } = response;

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('ticket');

      const { ticket: responseTicket } = body;

      expect(responseTicket.id).toBe(ticket.id);
      expect(responseTicket.project_id).toBe(project.id);
      expect(responseTicket.created_by).toBe(admin.id);
      expect(responseTicket.key).toBeTruthy();
      expect(responseTicket.name).toBe(ticket.name);
    });

    it('should respond with a ticket withGraphFetched', async () => {
      const response = await request(app).get(
        `${BASE_PATH}/${ticket.id}?withGraph=[project,type,status,priority,createdBy]`
      );

      const { statusCode, body } = response;

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('ticket');

      const { ticket: responseTicket } = body;

      expect(responseTicket.id).toBe(ticket.id);
      expect(responseTicket.project_id).toBe(project.id);
      expect(responseTicket.key).toBeTruthy();
      expect(responseTicket.name).toBe(ticket.name);
      expect(responseTicket.project.name).toBe(project.name);
      expect(responseTicket.createdBy.name).toBe(admin.name);

      ['type', 'status', 'priority'].forEach((property) => {
        expect(responseTicket[property]).toHaveProperty('name');
      });
    });
  });

  describe('POST /api/tickets', () => {
    it('should fail without token', async () => {
      const ticketData = pick(
        getTicketData({
          projectId: project.id,
        }),
        ['project_id', 'name', 'type_id', 'status_id', 'priority_id']
      );

      const response = await request(app).post(`${BASE_PATH}`).send(ticketData);

      expect(response.statusCode).toBe(401);
    });

    it('should fail if empty body provided', async () => {
      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .post(`${BASE_PATH}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
    });

    it('should fail if project does not exists', async () => {
      const ticketData = pick(
        getTicketData({
          projectId: project.id,
        }),
        ['project_id', 'name', 'type_id', 'status_id', 'priority_id']
      );

      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .post(`${BASE_PATH}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...ticketData, project_id: 123 });

      expect(response.statusCode).toBe(404);
    });

    it('should fail if auth user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const ticketData = pick(
        getTicketData({
          projectId: project.id,
        }),
        ['project_id', 'name', 'type_id', 'status_id', 'priority_id']
      );

      const response = await request(app)
        .post(`${BASE_PATH}`)
        .set('Authorization', `Bearer ${token}`)
        .send(ticketData);

      expect(response.statusCode).toBe(403);
    });

    it('should fail if required properties are not provided', async () => {
      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .post(`${BASE_PATH}`)
        .send({ project_id: project.id })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(422);
    });

    it('should create and respond with a ticket', async () => {
      const ticketData = pick(
        getTicketData({
          projectId: project.id,
        }),
        ['project_id', 'name', 'type_id', 'status_id', 'priority_id']
      );

      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .post(`${BASE_PATH}`)
        .set('Authorization', `Bearer ${token}`)
        .send(ticketData);

      const { statusCode, body } = response;

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('ticket');

      const { ticket: responseTicket } = body;

      expect(responseTicket.key).toBeTruthy();
      expect(responseTicket.created_by).toBe(admin.id);

      Object.entries(ticketData).forEach(([key, value]) => {
        expect(responseTicket[key]).toBe(value);
      });
    });
  });

  describe('PATCH /api/tickets/:ticketId', () => {
    let ticket;

    beforeEach(async () => {
      ticket = await TicketModel.query().insert(
        getTicketData({ projectId: project.id, createdBy: admin.id })
      );
    });

    it('should fail without a token', async () => {
      const response = await request(app)
        .patch(`${BASE_PATH}/${ticket.id}`)
        .send({ name: 'New name' });

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const response = await request(app)
        .patch(`${BASE_PATH}/${ticket.id}`)
        .send({ name: 'New name' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should update and respond with updated ticket', async () => {
      const token = getToken({ sub: admin.sub });

      const newTicketName = 'New ticket name';

      const response = await request(app)
        .patch(`${BASE_PATH}/${ticket.id}`)
        .send({ name: newTicketName })
        .set('Authorization', `Bearer ${token}`);

      const { statusCode, body } = response;

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('ticket');

      const { ticket: responseTicket } = body;

      expect(responseTicket.id).toBe(ticket.id);
      expect(responseTicket.project_id).toBe(project.id);
      expect(responseTicket.created_by).toBe(admin.id);
      expect(responseTicket.name).toBe(newTicketName);
    });
  });

  describe('DELETE /api/tickets/:ticketId', () => {
    let admin, project, ticket;

    beforeEach(async () => {
      admin = await UserModel.query().insert(getUserData({ isAdmin: true }));
      project = await ProjectModel.query().insert(
        getProjectData({ createdBy: admin.id })
      );
      ticket = await TicketModel.query().insert(
        getTicketData({ projectId: project.id, createdBy: admin.id })
      );
    });

    it('should fail without a token', async () => {
      const response = await request(app).delete(`${BASE_PATH}/${ticket.id}`);

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const response = await request(app)
        .delete(`${BASE_PATH}/${ticket.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should respond with 404 error if ticket does not exists', async () => {
      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .delete(`${BASE_PATH}/100`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });

    it('should delete and respond with a ticket', async () => {
      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .delete(`${BASE_PATH}/${ticket.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('ticket');
      expect(response.body.ticket.id).toBe(ticket.id);
      expect(response.body.archived_at).not.toBe(null);
    });
  });
});
