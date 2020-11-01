import supertest from 'supertest';
import { app } from '../../../app';
import db from '../../../db';
import setupTest from '../../../setupTests';
import teardownTest from '../../../teardownTests';
import { getProjectData, getUserData } from '../../../utils/testUtils';
import { Project } from '../project.model';
import { User } from '../../user/user.model';
import { getToken } from '../../../utils/fixtures';

const BASE_PATH = '/api/v1/projects';

describe('Test project engineers endpoints', () => {
  const thisDb = db;
  const ProjectModel = Project;
  const UserModel = User;

  beforeAll(() => setupTest(thisDb));

  afterAll(() => teardownTest(thisDb));

  afterEach(async () => {
    await UserModel.query().delete();
    await ProjectModel.query().delete();
  });

  describe('GET /api/v1/projects/:projectId/engineers', () => {
    it('should respond with an array of users', async () => {
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());

      await ProjectModel.relatedQuery('engineers')
        .for(project.id)
        .relate(user.id);

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
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());

      const response = await supertest(app).post(
        `${BASE_PATH}/${project.id}/engineers/${user.id}`
      );

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());

      await UserModel.query().insert(getUserData({ sub: 'auth0|123' }));
      const token = getToken({ sub: 'auth0|123' });

      const response = await supertest(app)
        .post(`${BASE_PATH}/${project.id}/engineers/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should add user to project as an engineer if auth user is an admin', async () => {
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());

      await UserModel.query().insert(
        getUserData({ sub: 'auth0|123', isAdmin: true })
      );
      const token = getToken({ sub: 'auth0|123' });

      const response = await supertest(app)
        .post(`${BASE_PATH}/${project.id}/engineers/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should add user to project as an engineer if auth user is a project manager', async () => {
      const user = await UserModel.query().insert(
        getUserData({ sub: 'auth0|123' })
      );
      const token = getToken({ sub: 'auth0|123' });

      const engineer = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(
        getProjectData({ managerId: user.id })
      );

      const response = await supertest(app)
        .post(`${BASE_PATH}/${project.id}/engineers/${engineer.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/v1/projects/:projectId/engineers/:userId', () => {
    it('should fail without passing token', async () => {
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());

      const response = await supertest(app).delete(
        `${BASE_PATH}/${project.id}/engineers/${user.id}`
      );

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());

      await UserModel.query().insert(getUserData({ sub: 'auth0|123' }));
      const token = getToken({ sub: 'auth0|123' });

      const response = await supertest(app)
        .delete(`${BASE_PATH}/${project.id}/engineers/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should remove project engineer if auth user is an admin', async () => {
      const engineer = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(getProjectData());

      await ProjectModel.relatedQuery('engineers')
        .for(project.id)
        .relate(engineer.id);

      await User.query().insert(
        getUserData({ sub: 'auth0|123', isAdmin: true })
      );
      const token = getToken({ sub: 'auth0|123' });

      const response = await supertest(app)
        .delete(`${BASE_PATH}/${project.id}/engineers/${engineer.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');

      const projectEngineers = await ProjectModel.relatedQuery('engineers').for(
        project.id
      );

      expect(projectEngineers.length).toBe(0);
    });

    it('should remove project engineer if auth user is a project manager', async () => {
      const engineer = await UserModel.query().insert(getUserData());
      const user = await User.query().insert(getUserData({ sub: 'auth0|123' }));
      const project = await ProjectModel.query().insert(
        getProjectData({ managerId: user.id })
      );

      await ProjectModel.relatedQuery('engineers')
        .for(project.id)
        .relate(engineer.id);

      const token = getToken({ sub: 'auth0|123' });

      const response = await supertest(app)
        .delete(`${BASE_PATH}/${project.id}/engineers/${engineer.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');

      const projectEngineers = await ProjectModel.relatedQuery('engineers').for(
        project.id
      );

      expect(projectEngineers.length).toBe(0);
    });
  });
});
