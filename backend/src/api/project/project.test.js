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
    it('should respond with an array of projects', async () => {
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );

      const response = await supertest(app).get(BASE_PATH);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(response.body.projects.length).toBe(1);
      expect(response.body.projects[0].id).toBe(project.id);
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should fail without auth token', async () => {
      const { name, type_id } = getProjectData();

      const response = await supertest(app)
        .post(BASE_PATH)
        .send({ name, type_id });

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });
      const { name, type_id } = getProjectData();

      const response = await supertest(app)
        .post(BASE_PATH)
        .send({ name, type_id })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should create and respond with a project', async () => {
      const user = await UserModel.query().insert(
        getUserData({ isAdmin: true })
      );
      const token = getToken({ sub: user.sub });
      const { name, type_id } = getProjectData();

      const response = await supertest(app)
        .post(BASE_PATH)
        .send({ name, type_id })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project).toHaveProperty('key');
      expect(response.body.project.name).toBe(name);
      expect(response.body.project.type_id).toBe(type_id);
      expect(response.body.project.created_by).toBe(user.id);
    });
  });

  describe('GET /api/v1/projects/:projectId', () => {
    it('should respond with 404 error if project does not exists', async () => {
      const response = await supertest(app).get(`${BASE_PATH}/123`);

      expect(response.statusCode).toBe(404);
    });

    it('should respond with a project', async () => {
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );

      const response = await supertest(app).get(`${BASE_PATH}/${project.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project).toHaveProperty('key');
      expect(response.body.project.name).toBe(project.name);
      expect(response.body.project.type_id).toBe(project.type_id);
      expect(response.body.project.created_by).toBe(user.id);
    });
  });

  describe('PATCH /api/v1/projects/:projectId', () => {
    it('should fail without auth token', async () => {
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );

      const newName = faker.commerce.productName();

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${project.id}`)
        .send({ name: newName });

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );
      const token = getToken({ sub: user.sub });

      const newName = faker.commerce.productName();

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${project.id}`)
        .send({ name: newName })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should update and respond with updated project', async () => {
      const user = await UserModel.query().insert(
        getUserData({ isAdmin: true })
      );
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );
      const token = getToken({ sub: user.sub });

      const newManager = await UserModel.query().insert(getUserData());

      const body = {
        name: 'Updated name',
        description: 'Project description',
        manager_id: newManager.id,
      };

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${project.id}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project.id).toBe(project.id);
      expect(response.body.project.key).toBe(project.key);
      expect(response.body.project.name).toBe(body.name);
      expect(response.body.project.description).toBe(body.description);
      expect(response.body.project.manager_id).toBe(body.manager_id);
    });
  });

  describe('DELETE /api/v1/projects/:projectId', () => {
    it('should fail without auth token', async () => {
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );

      const response = await supertest(app).delete(
        `${BASE_PATH}/${project.id}`
      );

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );
      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .delete(`${BASE_PATH}/${project.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should delete and respond with a project', async () => {
      const user = await UserModel.query().insert(
        getUserData({ isAdmin: true })
      );
      const token = getToken({ sub: user.sub });
      const project = await ProjectModel.query().insert(
        getProjectData({ createdBy: user.id })
      );

      const response = await supertest(app)
        .delete(`${BASE_PATH}/${project.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project.id).toBe(project.id);
    });
  });
});
