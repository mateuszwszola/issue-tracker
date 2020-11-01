import supertest from 'supertest';
import { app } from '../../../app';
import db from '../../../db';
import setupTest from '../../../setupTests';
import teardownTest from '../../../teardownTests';
import { getProjectData, getUserData } from '../../../utils/testUtils';
import { Project } from '../project.model';
import { User } from '../../user/user.model';
import jwt_decode from 'jwt-decode';

const BASE_PATH = '/api/v1/projects';

describe('Test project engineers endpoints', () => {
  const thisDb = db;

  beforeAll(() => setupTest(thisDb));

  afterAll(() => teardownTest(thisDb));

  describe('GET /api/v1/projects/:projectId/engineers', () => {
    it('should respond with an array of project engineers', async () => {
      const user = await User.query().insert(getUserData());
      const project = await Project.query().insert(getProjectData());

      await Project.relatedQuery('engineers').for(project.id).relate(user.id);

      const response = await supertest(app).get(
        `${BASE_PATH}/${project.id}/engineers`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('engineers');
      expect(response.body.engineers.length).toBe(1);
      expect(response.body.engineers[0].name).toBe(user.name);
      expect(response.body.engineers[0].email).toBe(user.email);
    });
  });

  describe('POST /api/v1/projects/:projectId/engineers/:userId', () => {
    it('should fail without passing token', async () => {
      const user = await User.query().insert(getUserData());
      const project = await Project.query().insert(getProjectData());

      const response = await supertest(app).post(
        `${BASE_PATH}/${project.id}/engineers/${user.id}`
      );

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await User.query().insert(getUserData());
      const project = await Project.query().insert(getProjectData());

      const access_token = process.env.access_token;
      const { sub } = jwt_decode(access_token);

      await User.query().insert(getUserData({ auth0_user_id: sub }));

      const response = await supertest(app)
        .post(`${BASE_PATH}/${project.id}/engineers/${user.id}`)
        .set('Authorization', `Bearer ${access_token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should add user to project as an engineer', async () => {
      const projectId = 1;
      const userId = 1;

      const response = await supertest(app).post(
        `${BASE_PATH}/${projectId}/engineers/${userId}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/v1/projects/:projectId/engineers/:userId', () => {
    it('should remove user from project engineers', async () => {
      const projectId = 1;
      const userId = 1;

      const response = await supertest(app).delete(
        `${BASE_PATH}/${projectId}/engineers/${userId}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});
