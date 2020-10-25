import supertest from 'supertest';
import { app } from '../../../app';
import db from '../../../db';
import setupTest from '../../../setupTests';
import teardownTest from '../../../teardownTests';
import { Project } from '../project.model';
import { createProjectFactory } from '../../../utils/testUtils';

const BASE_PATH = '/api/v1/projects';

describe('Test Project Engineer routes', () => {
  const thisDb = db;
  const ProjectModel = Project;

  beforeAll(() => setupTest(thisDb));

  afterAll(() => teardownTest(thisDb));

  beforeEach(async () => {
    await ProjectModel.query().insert(createProjectFactory());
  });

  afterEach(async () => {
    await ProjectModel.query().delete();
  });

  describe('GET /api/v1/projects/:projectId/engineers', () => {
    it('should respond with an array of project engineers', async () => {
      const projectId = 1;
      const userId = 1;

      await Project.relatedQuery('engineers').for(projectId).relate(userId);

      const response = await supertest(app).get(`${BASE_PATH}/1/engineers`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('engineers');
      expect(response.body.engineers.length).toBe(1);
    });
  });

  describe('POST /api/v1/projects/:projectId/engineers/:userId', () => {
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
