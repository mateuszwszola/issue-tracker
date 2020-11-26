import request from 'supertest';
import { app } from '../../../app';
import db from '../../../db';
import setupTest from '../../../setupTests';
import teardownTest from '../../../teardownTests';
import { Project } from '../project.model';
import { User } from '../../user/user.model';
import { getProjectData, getUserData } from '../../../fixtures/data';
import { getToken } from '../../../fixtures/jwt';

const BASE_PATH = '/api/projects';

describe('Test project engineers endpoints', () => {
  const thisDb = db;
  const ProjectModel = Project;
  const UserModel = User;

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
    await UserModel.query().delete();
    await ProjectModel.query().delete();
  });

  describe('GET /api/projects/:projectId/engineers', () => {
    it('should respond with an error if user is not authenticated', async () => {
      const response = await request(app).get(
        `${BASE_PATH}/${project.id}/engineers`
      );

      expect(response.statusCode).toBe(401);
    });

    it('should respond with 404 error if project does not exists', async () => {
      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .get(`${BASE_PATH}/123/engineers`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });

    it('should respond with an array of users (project engineers)', async () => {
      const engineer = await UserModel.query().insert(getUserData());
      await ProjectModel.relatedQuery('engineers')
        .for(project.id)
        .relate(engineer.id);

      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .get(`${BASE_PATH}/${project.id}/engineers`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('engineers.results');
      expect(response.body.engineers.results.length).toBe(1);
      expect(response.body.engineers.results[0].id).toBe(engineer.id);
    });
  });

  describe('POST /api/projects/:projectId/engineers/:userId', () => {
    it('should respond with an error if token not provided', async () => {
      const engineer = await UserModel.query().insert(getUserData());

      const response = await request(app).post(
        `${BASE_PATH}/${project.id}/engineers/${engineer.id}`
      );

      expect(response.statusCode).toBe(401);
    });

    it('should respond with an error if project does not exists', async () => {
      const engineer = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .post(`${BASE_PATH}/123/engineers/${engineer.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });

    it('should respond with an error if user is not authorized', async () => {
      const [user, engineer] = await Promise.all([
        UserModel.query().insert(getUserData()),
        UserModel.query().insert(getUserData()),
      ]);

      const token = getToken({ sub: user.sub });

      const response = await request(app)
        .post(`${BASE_PATH}/${project.id}/engineers/${engineer.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should add user to a project as an engineer if auth user is an admin', async () => {
      const engineer = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .post(`${BASE_PATH}/${project.id}/engineers/${engineer.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');

      const projectEngineers = await ProjectModel.relatedQuery('engineers').for(
        project.id
      );

      expect(projectEngineers.length).toBe(1);
    });

    it('should add user to a project as an engineer if auth user is a project manager', async () => {
      const [manager, engineer] = await Promise.all([
        UserModel.query().insert(getUserData()),
        UserModel.query().insert(getUserData()),
      ]);
      await ProjectModel.query()
        .for(project.id)
        .patch({ manager_id: manager.id });

      const token = getToken({ sub: manager.sub });

      const response = await request(app)
        .post(`${BASE_PATH}/${project.id}/engineers/${engineer.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');

      const projectEngineers = await ProjectModel.relatedQuery('engineers').for(
        project.id
      );

      expect(projectEngineers.length).toBe(1);
    });
  });

  describe('DELETE /api/projects/:projectId/engineers/:userId', () => {
    let engineer;
    beforeEach(async () => {
      engineer = await UserModel.query().insert(getUserData());

      await ProjectModel.relatedQuery('engineers')
        .for(project.id)
        .relate(engineer.id);
    });

    it('should respond with an error without token', async () => {
      const response = await request(app).delete(
        `${BASE_PATH}/${project.id}/engineers/${engineer.id}`
      );

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const response = await request(app)
        .delete(`${BASE_PATH}/${project.id}/engineers/${engineer.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should remove project engineer if auth user is an admin', async () => {
      const token = getToken({ sub: admin.sub });

      const response = await request(app)
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
      const manager = await UserModel.query().insert(getUserData());
      await ProjectModel.query()
        .for(project.id)
        .patch({ manager_id: manager.id });

      const token = getToken({ sub: manager.sub });

      const response = await request(app)
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
