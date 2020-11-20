import supertest from 'supertest';
import nock from 'nock';
import * as faker from 'faker';
import { app } from '../../app';
import db from '../../db';
import setupTests from '../../setupTests';
import teardownTests from '../../teardownTests';
import { User } from '../user/user.model';
import { getToken } from '../../fixtures/jwt';
import { getUserData } from '../../fixtures/data';
import config from '../../config';

const PATH = '/api/v1/auth/login';

function mockAuth0UserInfoCall(
  resStatusCode = 200,
  resBody = { message: 'Mock works!' }
) {
  return nock(`${config.auth0.issuer}`)
    .get('/userinfo')
    .reply(resStatusCode, resBody);
}

describe('Test the auth endpoints', () => {
  const thisDb = db;
  const UserModel = User;

  beforeAll(() => setupTests(thisDb));

  afterAll(() => teardownTests(thisDb));

  afterEach(async () => {
    await UserModel.query().delete();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should respond with an error if token not provided', async () => {
      const response = await supertest(app).post(PATH);

      expect(response.statusCode).toBe(401);
    });

    it('should respond with a user who already exists in the database', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .post(PATH)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.sub).toBe(user.sub);
    });

    it('should respond with an error if a request to the auth0 api fails', async () => {
      mockAuth0UserInfoCall(500, 'Something went wrong');

      const token = getToken({ sub: faker.random.uuid() });

      const response = await supertest(app)
        .post(PATH)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty('message');
    });

    it('should create and respond with newly created user', async () => {
      const { sub, name, email, picture } = getUserData();
      const token = getToken({ sub });
      const userProfile = { name, email, picture };

      mockAuth0UserInfoCall(200, userProfile);

      const response = await supertest(app)
        .post(PATH)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.sub).toBe(sub);
      expect(response.body.user.name).toBe(name);
      expect(response.body.user.email).toBe(email);
      expect(response.body.user.picture).toBe(picture);
    });
  });
});
