import supertest from 'supertest';
import * as faker from 'faker';
import { app } from '../../app';
import db from '../../db';
import setupTest from '../../setupTests';
import teardownTest from '../../teardownTests';
import { Project } from '../project/project.model';

const BASE_PATH = '/api/v1/projects';

describe('User routes', () => {
  const thisDb = db;
  const ProjectModel = Project;

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

    const response = await supertest(app).post(BASE_PATH).send(project);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('project');
  });

  it('should return a project', async () => {
    const project = {
      name: faker.random.alphaNumeric(20),
      key: faker.random.alphaNumeric(5),
      description: faker.random.alphaNumeric(60),
      owner_id: 1,
      manager_id: 1,
      type_id: 1,
    };

    const { id: projectId } = await ProjectModel.query()
      .insert(project)
      .returning('id');

    const response = await supertest(app).get(`${BASE_PATH}/${projectId}`);

    expect(response.statusCode).toBe(200);
  });

  it('should return list of projects', async () => {
    const response = await supertest(app).get(BASE_PATH);

    console.log(response.body.projects);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('projects');
  });

  it('should update and return project', async () => {
    const project = {
      name: faker.random.alphaNumeric(20),
      key: faker.random.alphaNumeric(5),
      description: faker.random.alphaNumeric(60),
      owner_id: 1,
      manager_id: 1,
      type_id: 1,
    };

    const { id: projectId } = await ProjectModel.query()
      .insert(project)
      .returning('id');

    const newName = faker.name.firstName() + ' ' + faker.name.lastName();

    const response = await supertest(app)
      .put(`${BASE_PATH}/${projectId}`)
      .send({ name: newName });

    expect(response.statusCode).toBe(200);
  });

  afterAll(() => teardownTest(thisDb));
});
