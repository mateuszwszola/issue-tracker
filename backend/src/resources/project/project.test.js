import { app } from '../../app';
import db from '../../db';
import supertest from 'supertest';
import setupTest from '../../setupTests';
import teardownTest from '../../teardownTests';

describe('User routes', () => {
  const thisDb = db;

  beforeAll(() => setupTest(thisDb));

  it('should return list of projects', async () => {
    const response = await supertest(app).get('/api/v1/projects');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('projects');
  });

  afterAll(() => teardownTest(thisDb));
});
