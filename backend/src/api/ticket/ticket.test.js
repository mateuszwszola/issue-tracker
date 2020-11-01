import supertest from 'supertest';
import { app } from '../../app';
import db from '../../db';
import setupTest from '../../setupTests';
import teardownTest from '../../teardownTests';
import { User } from '../user/user.model';
import { Ticket } from './ticket.model';
import { Project } from '../project/project.model';
import { getProjectData, getUserData } from '../../utils/testUtils';

const BASE_PATH = '/api/v1/tickets';

describe('Test the ticket endpoints', () => {
  const thisDb = db;
  const UserModel = User;
  const ProjectModel = Project;
  const TicketModel = Ticket;

  let user;
  let project;

  beforeAll(() => setupTest(thisDb));

  afterAll(() => teardownTest(thisDb));

  beforeEach(async () => {
    user = await UserModel.query().insert(getUserData()).returning('*');
    project = await ProjectModel.query()
      .insert(getProjectData())
      .returning('*');
  });

  afterEach(async () => {
    await TicketModel.query().delete();
    await ProjectModel.query().findById(project.id).delete();
    await UserModel.query().findById(user.id).delete();
  });

  describe('GET /api/v1/tickets', () => {
    it('should respond with an array of tickets', async () => {
      const response = await supertest(app).get(BASE_PATH);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('tickets');
    });
  });

  describe('POST /api/v1/tickets', () => {
    it('');
  });
});
