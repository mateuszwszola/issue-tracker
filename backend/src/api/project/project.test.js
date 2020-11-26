import request from 'supertest';
import { app } from '../../app';
import db from '../../db';
import setupTest from '../../setupTests';
import teardownTest from '../../teardownTests';
import { Project } from './project.model';
import { User } from '../user/user.model';
import { getProjectData, getUserData } from '../../fixtures/data';
import { getToken } from '../../fixtures/jwt';

const BASE_PATH = '/api/projects';

describe('Test the project endpoints', () => {
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
    await ProjectModel.query().delete();
    await UserModel.query().delete();
  });

  describe('GET /api/projects', () => {
    it('should respond with an array of projects', async () => {
      const response = await request(app).get(`${BASE_PATH}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(response.body.projects.length).toBe(1);
      expect(response.body.projects[0].id).toBe(project.id);
    });
  });

  describe('POST /api/projects', () => {
    it('should fail without auth token', async () => {
      const { name, type_id } = getProjectData();

      const response = await request(app)
        .post(BASE_PATH)
        .send({ name, type_id });

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });
      const { name, type_id } = getProjectData();

      const response = await request(app)
        .post(BASE_PATH)
        .send({ name, type_id })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should create and respond with a project', async () => {
      const token = getToken({ sub: admin.sub });
      const { name, type_id } = getProjectData();

      const response = await request(app)
        .post(BASE_PATH)
        .send({ name, type_id })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project).toHaveProperty('key');
      expect(response.body.project.name).toBe(name);
      expect(response.body.project.type_id).toBe(type_id);
      expect(response.body.project.created_by).toBe(admin.id);
    });
  });

  describe('GET /api/projects/:projectId', () => {
    it('should respond with 404 error if project does not exists', async () => {
      const response = await request(app).get(`${BASE_PATH}/123`);

      expect(response.statusCode).toBe(404);
    });

    it('should respond with a project', async () => {
      const response = await request(app).get(`${BASE_PATH}/${project.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project).toHaveProperty('key');
      expect(response.body.project.name).toBe(project.name);
      expect(response.body.project.type_id).toBe(project.type_id);
      expect(response.body.project.created_by).toBe(admin.id);
    });
  });

  describe('PATCH /api/projects/:projectId', () => {
    it('should fail without auth token', async () => {
      const newName = 'New project name';

      const response = await request(app)
        .patch(`${BASE_PATH}/${project.id}`)
        .send({ name: newName });

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const newName = 'New project name';

      const response = await request(app)
        .patch(`${BASE_PATH}/${project.id}`)
        .send({ name: newName })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should update and respond with a project', async () => {
      const token = getToken({ sub: admin.sub });

      const newManager = await UserModel.query().insert(getUserData());

      const data = {
        name: 'Updated name',
        description: 'Project description',
        manager_id: newManager.id,
      };

      const response = await request(app)
        .patch(`${BASE_PATH}/${project.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(data);

      const { statusCode, body } = response;

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('project');

      const { project: responseProject } = body;

      expect(responseProject.id).toBe(project.id);
      expect(responseProject.key).toBe(project.key);
      expect(responseProject.name).toBe(data.name);
      expect(responseProject.description).toBe(data.description);
      expect(responseProject.manager_id).toBe(data.manager_id);
    });
  });

  describe('DELETE /api/projects/:projectId', () => {
    it('should fail without auth token', async () => {
      const response = await request(app).delete(`${BASE_PATH}/${project.id}`);

      expect(response.statusCode).toBe(401);
    });

    it('should fail if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const response = await request(app)
        .delete(`${BASE_PATH}/${project.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should delete and respond with a project', async () => {
      const token = getToken({ sub: admin.sub });

      const response = await request(app)
        .delete(`${BASE_PATH}/${project.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project.id).toBe(project.id);
    });
  });
});
