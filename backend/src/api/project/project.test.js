import supertest from 'supertest';
import * as faker from 'faker';
import { app } from '../../app';
import db from '../../db';
import setupTest from '../../setupTests';
import teardownTest from '../../teardownTests';

describe('User routes', () => {
  const thisDb = db;

  beforeAll(() => setupTest(thisDb));

  it('should create project', async () => {
    const project = {
      name: faker.random.alphaNumeric(20),
      key: faker.random.alphaNumeric(5),
      description: faker.random.alphaNumeric(60),
      owner_id: 1,
      manager_id: 1,
      type_id: 1,
    };

    const response = await supertest(app)
      .post('/api/v1/projects')
      .send(project);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('project');
    expect(response.body.project.name).toBe(project.name);
    expect(response.body.project.key).toBe(project.key);
    expect(response.body.project.description).toBe(project.description);
  });

  it('should return list of projects', async () => {
    const response = await supertest(app).get('/api/v1/projects');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('projects');
  });

  afterAll(() => teardownTest(thisDb));
});
