import supertest from 'supertest';
import { app } from '../../../app';
import db from '../../../db';
import setupTest from '../../../setupTests';
import teardownTest from '../../../teardownTests';
import { Project } from '../project.model';
import { User } from '../../user/user.model';
import { Ticket } from '../ticket.model';
import {
  getProjectData,
  getUserData,
  getTicketData,
} from '../../../fixtures/data';
import { getToken } from '../../../fixtures/jwt';

const BASE_PATH = '/api/v1/projects';

describe('Test ticket engineer endpoints', () => {
  const thisDb = db;
  const UserModel = User;
  const ProjectModel = Project;
  const TicketModel = Ticket;

  beforeAll(() => setupTest(thisDb));

  afterAll(() => teardownTest(thisDb));

  afterEach(async () => {
    await UserModel.query().delete();
    await ProjectModel.query().delete();
    await TicketModel.query().delete();
  });

  describe('GET /api/v1/projects/:projectId/tickets/:ticketId/engineers', () => {
    it('should respond with an array of ticket engineers', async () => {
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData());
      const engineer = await TicketModel.relatedQuery('engineers')
        .for(ticket.id)
        .insert(getUserData());

      const response = await supertest(app).get(
        `${BASE_PATH}/${project.id}/tickets/${ticket.id}/engineers`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('engineers');
      expect(response.body.engineers.length).toBe(1);
      expect(response.body.engineers[0]).toHaveProperty('id');
      expect(response.body.engineers[0].name).toBe(engineer.name);
      expect(response.body.engineers[0].email).toBe(engineer.email);
      expect(response.body.engineers[0].picture).toBe(engineer.picture);
    });
  });

  describe('POST /api/v1/projects/:projectId/tickets/:ticketId/engineers/:userId', () => {
    it('should fail without passing token', async () => {
      const engineer = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData());

      const response = await supertest(app).post(
        `${BASE_PATH}/${project.id}/tickets/${ticket.id}/engineers/${engineer.id}`
      );

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123' })
      );
      const engineer = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData());

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .post(
          `${BASE_PATH}/${project.id}/tickets/${ticket.id}/engineers/${engineer.id}`
        )
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should add a ticket engineer if auth user is an admin', async () => {
      const engineer = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData());

      await UserModel.query().insert(
        getUserData({ sub: 'auth0|123', isAdmin: true })
      );
      const token = getToken({ sub: 'auth0|123' });

      const response = await supertest(app)
        .post(
          `${BASE_PATH}/${project.id}/tickets/${ticket.id}/engineers/${engineer.id}`
        )
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should add user to project as an engineer if auth user is a project manager', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123' })
      );
      const engineer = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(
        getProjectData({ managerId: user.id })
      );
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData());

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .post(
          `${BASE_PATH}/${project.id}/tickets/${ticket.id}/engineers/${engineer.id}`
        )
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/v1/projects/:projectId/tickets/:ticketId/engineers/:userId', () => {
    it('should fail without passing token', async () => {
      const engineer = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData());

      const response = await supertest(app).delete(
        `${BASE_PATH}/${project.id}/tickets/${ticket.id}/engineers/${engineer.id}`
      );

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123' })
      );
      const engineer = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData());
      await TicketModel.relatedQuery('engineers')
        .for(ticket.id)
        .relate(engineer.id);

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .delete(
          `${BASE_PATH}/${project.id}/tickets/${ticket.id}/engineers/${engineer.id}`
        )
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should remove ticket engineer if auth user is an admin', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123', isAdmin: true })
      );
      const engineer = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData());
      await TicketModel.relatedQuery('engineers')
        .for(ticket.id)
        .relate(engineer.id);

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .delete(
          `${BASE_PATH}/${project.id}/tickets/${ticket.id}/engineers/${engineer.id}`
        )
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');

      const ticketEngineers = await TicketModel.relatedQuery('engineers').for(
        ticket.id
      );
      expect(ticketEngineers.length).toBe(0);
    });

    it('should remove project engineer if auth user is a project manager', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123' })
      );
      const engineer = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(
        getProjectData({ managerId: user.id })
      );
      const ticket = await ProjectModel.relatedQuery('tickets')
        .for(project.id)
        .insert(getTicketData());
      await TicketModel.relatedQuery('engineers')
        .for(ticket.id)
        .relate(engineer.id);

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .delete(
          `${BASE_PATH}/${project.id}/tickets/${ticket.id}/engineers/${engineer.id}`
        )
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');

      const ticketEngineers = await TicketModel.relatedQuery('engineers').for(
        ticket.id
      );
      expect(ticketEngineers.length).toBe(0);
    });
  });
});
