import supertest from 'supertest';
import * as faker from 'faker';
import { app } from '../../app';
import db from '../../db';
import setupTest from '../../setupTests';
import teardownTest from '../../teardownTests';
import { Project } from '../project/project.model';

const createProject = (ctx = {}) => ({
  name: ctx.name || faker.name.findName(),
  key: ctx.key || faker.random.alphaNumeric(5),
  description: ctx.description || faker.random.alphaNumeric(60),
  owner_id: ctx.ownerId || 1,
  manager_id: ctx.managerId || 1,
  type_id: ctx.typeId || 1,
});

const BASE_PATH = '/api/v1/projects';

describe('test the project routes', () => {
  const thisDb = db;
  const ProjectModel = Project;

  beforeAll(() => setupTest(thisDb));

  afterAll(() => teardownTest(thisDb));

  beforeEach(async () => {
    await ProjectModel.query().insert([createProject(), createProject()]);
  });

  afterEach(async () => {
    await ProjectModel.query().delete();
  });

  describe('GET /api/v1/projects', () => {
    it('should respond with an array of projects', async () => {
      const response = await supertest(app).get(BASE_PATH);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(response.body.projects.length).toBe(2);
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should create and respond with a project', async () => {
      const project = createProject();

      const response = await supertest(app).post(BASE_PATH).send(project);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project.name).toBe(project.name);
      expect(response.body.project.key).toBe(project.key);
      expect(response.body.project.description).toBe(project.description);
    });
  });

  describe('PATCH /api/v1/projects/:id', () => {
    it('should update and respond with updated project', async () => {
      const project = createProject();
      const { id: projectId } = await ProjectModel.query().insert(project);

      const newName = faker.name.findName();

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${projectId}`)
        .send({ name: newName });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project.name).toBe(newName);
      expect(response.body.project.key).toBe(project.key);
      expect(response.body.project.description).toBe(project.description);
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should delete and respond with a project', async () => {
      const project = createProject();
      const { id: projectId } = await ProjectModel.query().insert(project);

      const response = await supertest(app).delete(`${BASE_PATH}/${projectId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('project');
    });
  });
});
