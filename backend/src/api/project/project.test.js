import supertest from 'supertest';
import * as faker from 'faker';
import { app } from '../../app';
import db from '../../db';
import setupTest from '../../setupTests';
import teardownTest from '../../teardownTests';
import { Project } from './project.model';
import { User } from '../user/user.model';
import { getProjectData, getUserData } from '../../fixtures/data';
import { getToken } from '../../fixtures/jwt';

const BASE_PATH = '/api/v1/projects';

describe('Test the project endpoints', () => {
  const thisDb = db;
  const ProjectModel = Project;
  const UserModel = User;

  beforeAll(() => setupTest(thisDb));

  afterAll(() => teardownTest(thisDb));

  afterEach(async () => {
    await ProjectModel.query().delete();
    await UserModel.query().delete();
  });

  describe('GET /api/v1/projects', () => {
    beforeEach(async () => {
      await ProjectModel.query().insert(getProjectData());
    });

    it('should respond with an array of projects', async () => {
      const response = await supertest(app).get(BASE_PATH);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(response.body.projects.length).toBe(1);
    });
  });

  describe('GET /api/v1/projects/:projectId', () => {
    it('should respond with a project', async () => {
      const project = await Project.query().insert(getProjectData());

      const response = await supertest(app).get(`${BASE_PATH}/${project.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project).toHaveProperty('key');
      expect(response.body.project.name).toBe(project.name);
      expect(response.body.project.type_id).toBe(project.type_id);
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should fail without auth token', async () => {
      const project = getProjectData();

      const response = await supertest(app).post(BASE_PATH).send(project);

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      await UserModel.query().insert(getUserData({ sub: 'auth0|123' }));
      const token = getToken({ sub: 'auth0|123' });
      const project = getProjectData();

      const response = await supertest(app)
        .post(BASE_PATH)
        .send(project)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should create and respond with a project', async () => {
      await UserModel.query().insert(
        getUserData({ sub: 'auth0|123', isAdmin: true })
      );
      const token = getToken({ sub: 'auth0|123' });
      const project = getProjectData();

      const response = await supertest(app)
        .post(BASE_PATH)
        .send(project)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project).toHaveProperty('key');
      expect(response.body.project.name).toBe(project.name);
      expect(response.body.project.type_id).toBe(1);
    });
  });

  describe('PATCH /api/v1/projects/:projectId', () => {
    it('should fail without auth token', async () => {
      const project = await Project.query().insert(getProjectData());

      const newName = faker.commerce.productName();

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${project.id}`)
        .send({ name: newName });

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      await UserModel.query().insert(getUserData({ sub: 'auth0|123' }));
      const project = await Project.query().insert(getProjectData());
      const token = getToken({ sub: 'auth0|123' });

      const newName = faker.commerce.productName();

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${project.id}`)
        .send({ name: newName })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should update and respond with updated project', async () => {
      await UserModel.query().insert(
        getUserData({ sub: 'auth0|123', isAdmin: true })
      );
      const project = await Project.query().insert(getProjectData());
      const token = getToken({ sub: 'auth0|123' });

      const newName = faker.commerce.productName();

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${project.id}`)
        .send({ name: newName })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project).toHaveProperty('key');
      expect(response.body.project.name).toBe(newName);
    });
  });

  describe('DELETE /api/v1/projects/:projectId', () => {
    it('should fail without auth token', async () => {
      const project = await Project.query().insert(getProjectData());

      const response = await supertest(app).delete(
        `${BASE_PATH}/${project.id}`
      );

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      await UserModel.query().insert(getUserData({ sub: 'auth0|123' }));
      const token = getToken({ sub: 'auth0|123' });
      const project = await Project.query().insert(getProjectData());

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${project.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should delete and respond with a project', async () => {
      await UserModel.query().insert(
        getUserData({ sub: 'auth0|123', isAdmin: true })
      );
      const token = getToken({ sub: 'auth0|123' });
      const project = await Project.query().insert(getProjectData());

      const response = await supertest(app)
        .delete(`${BASE_PATH}/${project.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('project');
    });
  });
});
