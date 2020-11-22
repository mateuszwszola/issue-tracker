import supertest from 'supertest';
import { app } from '../../../app';
import db from '../../../db';
import setupTest from '../../../setupTests';
import teardownTest from '../../../teardownTests';
import { Project } from '../project.model';
import { User } from '../../user/user.model';
import { getProjectData, getUserData } from '../../../fixtures/data';
import { getToken } from '../../../fixtures/jwt';

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
    it('should respond with an error if user is not authenticated', async () => {
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );

      const response = await supertest(app).get(
        `${BASE_PATH}/${project.id}/engineers`
      );

      expect(response.statusCode).toBe(401);
    });

    it('should respond with 404 error if project does not exists', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .get(`${BASE_PATH}/123/engineers`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });

    it('should respond with an array of users (project engineers)', async () => {
      const [user, engineer] = await Promise.all([
        await UserModel.query().insert(getUserData()),
        await UserModel.query().insert(getUserData()),
      ]);
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );

      await ProjectModel.relatedQuery('engineers')
        .for(project.id)
        .relate(engineer.id);

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .get(`${BASE_PATH}/${project.id}/engineers`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('engineers');
      expect(response.body.engineers.length).toBe(1);
      expect(response.body.engineers[0].id).toBe(engineer.id);
    });
  });

  describe('POST /api/v1/projects/:projectId/engineers/:userId', () => {
    it('should respond with an error without token', async () => {
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );

      const response = await supertest(app).post(
        `${BASE_PATH}/${project.id}/engineers/${user.id}`
      );

      expect(response.statusCode).toBe(401);
    });

    it('should respond with an error if project does not exists', async () => {
      const [user, engineer] = await Promise.all([
        await UserModel.query().insert(getUserData()),
        await UserModel.query().insert(getUserData()),
      ]);
      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .post(`${BASE_PATH}/123/engineers/${engineer.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });

    it('should respond with an error if user is not authorized', async () => {
      const [user, engineer] = await Promise.all([
        UserModel.query().insert(getUserData()),
        UserModel.query().insert(getUserData()),
      ]);
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .post(`${BASE_PATH}/${project.id}/engineers/${engineer.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should add user to a project as an engineer if auth user is an admin', async () => {
      const [user, engineer] = await Promise.all([
        UserModel.query().insert(getUserData({ isAdmin: true })),
        UserModel.query().insert(getUserData()),
      ]);
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );
      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
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
      const [user, engineer] = await Promise.all([
        UserModel.query().insert(getUserData()),
        UserModel.query().insert(getUserData()),
      ]);
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id, managerId: user.id })
      );
      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
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

  describe('DELETE /api/v1/projects/:projectId/engineers/:userId', () => {
    it('should respond with an error without token', async () => {
      const [user, engineer] = await Promise.all([
        UserModel.query().insert(getUserData()),
        UserModel.query().insert(getUserData()),
      ]);
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );

      await ProjectModel.relatedQuery('engineers')
        .for(project.id)
        .relate(engineer.id);

      const response = await supertest(app).delete(
        `${BASE_PATH}/${project.id}/engineers/${engineer.id}`
      );

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const [user, engineer] = await Promise.all([
        UserModel.query().insert(getUserData()),
        UserModel.query().insert(getUserData()),
      ]);

      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );

      await ProjectModel.relatedQuery('engineers')
        .for(project.id)
        .relate(engineer.id);

      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .delete(`${BASE_PATH}/${project.id}/engineers/${engineer.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should remove project engineer if auth user is an admin', async () => {
      const [user, engineer] = await Promise.all([
        UserModel.query().insert(getUserData({ isAdmin: true })),
        UserModel.query().insert(getUserData()),
      ]);
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );

      await ProjectModel.relatedQuery('engineers')
        .for(project.id)
        .relate(engineer.id);

      const token = getToken({ sub: user.sub });

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
      const [user, engineer] = await Promise.all([
        UserModel.query().insert(getUserData()),
        UserModel.query().insert(getUserData()),
      ]);

      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id, managerId: user.id })
      );

      await ProjectModel.relatedQuery('engineers')
        .for(project.id)
        .relate(engineer.id);

      const token = getToken({ sub: user.sub });

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
