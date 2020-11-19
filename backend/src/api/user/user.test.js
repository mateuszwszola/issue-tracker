import supertest from 'supertest';
import { app } from '../../app';
import db from '../../db';
import setupTests from '../../setupTests';
import teardownTests from '../../teardownTests';
import { User } from './user.model';
import { getToken } from '../../fixtures/jwt';
import { getUserData } from '../../fixtures/data';

const BASE_PATH = '/api/v1/users';

describe('Test the users endpoints', () => {
  const thisDb = db;
  const UserModel = User;

  beforeAll(() => setupTests(thisDb));

  afterAll(() => teardownTests(thisDb));

  afterEach(async () => {
    await UserModel.query().delete();
  });

  describe(`GET ${BASE_PATH}`, () => {
    it('should respond with an error if token not provided', async () => {
      const response = await supertest(app).get(BASE_PATH);

      expect(response.statusCode).toBe(401);
    });

    it('should respond with an error if user is not authorized', async () => {});

    it('should respond with an error if invalid page query param', async () => {});

    it('should respond with an error if page number is less than 1', async () => {});

    it('should respond with an array of users', async () => {});
  });

  describe(`POST ${BASE_PATH}`, () => {});

  describe(`GET ${BASE_PATH}/:userId`, () => {});

  describe(`PUT ${BASE_PATH}/:userId`, () => {});

  describe(`DELETE ${BASE_PATH}/:userId`, () => {});
});
