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
import { TicketStatus } from './ticketStatus/ticketStatus.model';
import { TICKET_STATUSES } from '../../constants/ticket';

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

  describe('GET /api/tickets', () => {
    it('should respond with an error if invalid query param provided', async () => {
      const { statusCode } = await request(app).get(
        `${BASE_PATH}?orderBy=invalid`
      );

      expect(statusCode).toBe(400);
    });

    it('should respond with an array of tickets', async () => {
      const response = await request(app).get(`${BASE_PATH}`);

      const { statusCode, body } = response;

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('tickets');
      expect(Array.isArray(body.tickets)).toBe(true);
    });

    it('should respond with an array of project tickets', async () => {
      await TicketModel.query().insert(
        getTicketData({ projectId: project.id, createdBy: admin.id })
      );

      const response = await request(app).get(
        `${BASE_PATH}?project_id=${project.id}`
      );

      const { statusCode, body } = response;

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('tickets');

      const [responseTicket] = body.tickets;

      expect(responseTicket.project_id).toBe(project.id);
    });

    it('should respond with an array of project tickets withGraphFetched', async () => {
      await TicketModel.query().insert(
        getTicketData({ projectId: project.id, createdBy: admin.id })
      );

      const response = await request(app).get(
        `${BASE_PATH}?project_id=${project.id}&withGraph=[project,type,status,priority,createdBy]`
      );

      const { statusCode, body } = response;

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('tickets');

      const [responseTicket] = body.tickets;

      expect(responseTicket.project.name).toBe(project.name);

      ['type', 'status', 'priority', 'createdBy'].forEach((property) => {
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
    it('When no token provided, should respond with 401', async () => {
      const ticketData = pick(
        getTicketData({
          projectId: project.id,
        }),
        ['project_id', 'name', 'type_id', 'status_id', 'priority_id']
      );

      const response = await request(app).post(`${BASE_PATH}`).send(ticketData);

      expect(response.statusCode).toBe(401);
    });

    it('When empty body provided, should respond with an error', async () => {
      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .post(`${BASE_PATH}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(422);
    });

    it('When project does not exists, should respond with 404', async () => {
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

    it('When required properties are not provided, should return an error', async () => {
      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .post(`${BASE_PATH}`)
        .send({ project_id: project.id })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(422);
    });

    it('When admin user is adding, should create and respond with a ticket', async () => {
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

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('ticket');

      const { ticket: responseTicket } = body;

      expect(responseTicket.key).toBeTruthy();
      expect(responseTicket.created_by).toBe(admin.id);

      Object.entries(ticketData).forEach(([key, value]) => {
        expect(responseTicket[key]).toBe(value);
      });
    });

    it(`When user with "user" role is adding new ticket with standard properties, it should add and respond with a ticket`, async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });
      const ticketData = pick(
        getTicketData({
          projectId: project.id,
        }),
        ['project_id', 'name', 'description', 'type_id']
      );

      const response = await request(app)
        .post(`${BASE_PATH}`)
        .set('Authorization', `Bearer ${token}`)
        .send(ticketData);

      expect(response.statusCode).toBe(201);
    });

    it('When not authorized user is trying to set additional ticket properties, it should skip them and create a new ticket', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });
      const ticketData = pick(
        getTicketData({
          projectId: project.id,
        }),
        [
          'project_id',
          'name',
          'description',
          'type_id',
          'priority_id',
          'assignee_id',
        ]
      );

      const response = await request(app)
        .post(`${BASE_PATH}`)
        .set('Authorization', `Bearer ${token}`)
        .send(ticketData);

      expect(response.statusCode).toBe(201);
      expect(response.body.ticket.priority_id).toBeNull();
      expect(response.body.ticket.assignee_id).toBeNull();
    });
  });

  describe('PATCH /api/tickets/:ticketId', () => {
    let ticket;

    beforeEach(async () => {
      ticket = await TicketModel.query().insert(
        getTicketData({ projectId: project.id, createdBy: admin.id })
      );
    });

    it('When no token provided, should respond with 401', async () => {
      const response = await request(app)
        .patch(`${BASE_PATH}/${ticket.id}`)
        .send({ name: 'New name' });

      expect(response.statusCode).toBe(401);
    });

    it('When user is not authorized, should respond with 403', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const response = await request(app)
        .patch(`${BASE_PATH}/${ticket.id}`)
        .send({ name: 'New name' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('When admin is updating, should update and respond with an updated ticket', async () => {
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

    it('When submitter is updating and the ticket is no longer in the submitted state, should respond with 403', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });
      const { id: openTicketStatusId } = await TicketStatus.query()
        .findOne({ name: TICKET_STATUSES.open })
        .select('id');
      const ticket = await TicketModel.query().insert(
        getTicketData({
          projectId: project.id,
          createdBy: user.id,
          statusId: openTicketStatusId,
        })
      );

      const { name: newName } = getTicketData();

      const response = await request(app)
        .patch(`${BASE_PATH}/${ticket.id}`)
        .send({ name: newName })
        .set('Authorization', `Bearer ${token}`);

      console.log('response.body', response.body);

      expect(response.statusCode).toBe(403);
    });

    it('When submitter is updating and the ticket is still in the submitted state should update and respond with a ticket', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });
      const {
        id: submittedTicketStatusId,
      } = await TicketStatus.query()
        .findOne({ name: TICKET_STATUSES.submitted })
        .select('id');
      const ticket = await TicketModel.query().insert(
        getTicketData({
          projectId: project.id,
          createdBy: user.id,
          statusId: submittedTicketStatusId,
        })
      );

      const newTicketData = pick(getTicketData(), ['name', 'description']);

      const response = await request(app)
        .patch(`${BASE_PATH}/${ticket.id}`)
        .send(newTicketData)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
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

    it('When the token is not provided, should respond with 401', async () => {
      const response = await request(app).delete(`${BASE_PATH}/${ticket.id}`);

      expect(response.statusCode).toBe(401);
    });

    it('When user is not authorized, should respond with 403', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const response = await request(app)
        .delete(`${BASE_PATH}/${ticket.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('When ticket does not exists, should respond with 404', async () => {
      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .delete(`${BASE_PATH}/100`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });

    it('When admin is deleting, should delete and respond with ticket', async () => {
      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .delete(`${BASE_PATH}/${ticket.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('ticket');
      expect(response.body.ticket.id).toBe(ticket.id);
      expect(response.body.archived_at).not.toBe(null);
    });

    it('When submitter is deleting its own ticket, and it is no longer in the submitted state, should respond with 403', async () => {
      const user = await UserModel.query().insert(getUserData());
      const { id: openTicketStatusId } = await TicketStatus.query()
        .findOne({ name: TICKET_STATUSES.open })
        .select('id');
      const ticket = await TicketModel.query().insert(
        getTicketData({
          projectId: project.id,
          createdBy: user.id,
          statusId: openTicketStatusId,
        })
      );
      const token = getToken({ sub: user.sub });

      const response = await request(app)
        .delete(`${BASE_PATH}/${ticket.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('When submitter is deleting its own ticket, and it is still in the submitted state, should delete', async () => {
      const user = await UserModel.query().insert(getUserData());
      const { id: submittedStatusId } = await TicketStatus.query()
        .findOne({ name: TICKET_STATUSES.submitted })
        .select('id');
      const ticket = await TicketModel.query().insert(
        getTicketData({
          projectId: project.id,
          createdBy: user.id,
          statusId: submittedStatusId,
        })
      );
      const token = getToken({ sub: user.sub });

      const response = await request(app)
        .delete(`${BASE_PATH}/${ticket.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
    });
  });
});
