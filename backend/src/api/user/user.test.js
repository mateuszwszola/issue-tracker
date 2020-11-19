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

  describe(`GET /api/v1/users`, () => {
    it('should respond with an error if token not provided', async () => {
      const response = await supertest(app).get(BASE_PATH);

      expect(response.statusCode).toBe(401);
    });

    it('should respond with an error if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .get(BASE_PATH)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should respond with an array of users', async () => {
      const user = await UserModel.query().insert(
        getUserData({ isAdmin: true })
      );
      const token = getToken({ sub: user.sub });

      await UserModel.query().insert([getUserData(), getUserData()]);

      const response = await supertest(app)
        .get(BASE_PATH)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(response.body.users.length).toBe(3);
    });
  });

  describe(`POST /api/v1/users`, () => {
    it('should respond with an error if token not provided', async () => {
      const response = await supertest(app).post(BASE_PATH);

      expect(response.statusCode).toBe(401);
    });

    it('should respond with an error if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .post(BASE_PATH)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should respond with an error if req body does not pass schema validation', async () => {
      const user = await UserModel.query().insert(
        getUserData({ isAdmin: true })
      );
      const token = getToken({ sub: user.sub });

      const body = {
        email: 'this-is-not-a-valid-email',
        name: '',
      };

      const response = await supertest(app)
        .post(BASE_PATH)
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.statusCode).toBe(422);
    });

    it('should create a user with extra props (that only admin can do) and respond with a user', async () => {
      const user = await UserModel.query().insert(
        getUserData({ isAdmin: true })
      );
      const token = getToken({ sub: user.sub });

      const { name, email } = getUserData();

      const response = await supertest(app)
        .post(BASE_PATH)
        .set('Authorization', `Bearer ${token}`)
        .send({ name, email, is_admin: true });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.name).toBe(name);
      expect(response.body.user.email).toBe(email);
      expect(response.body.user.is_admin).toBe(true);
    });
  });

  describe(`GET /api/v1/users/:userId`, () => {
    it('should respond with an error if token not provided', async () => {
      const response = await supertest(app).get(`${BASE_PATH}/123`);

      expect(response.statusCode).toBe(401);
    });

    it('should respond with an error if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .get(`${BASE_PATH}/123`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should respond with 404 if user does not exists', async () => {
      const authUser = await UserModel.query().insert(
        getUserData({ isAdmin: true })
      );
      const token = getToken({ sub: authUser.sub });

      const response = await supertest(app)
        .get(`${BASE_PATH}/123`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });

    it('should respond with a user', async () => {
      const authUser = await UserModel.query().insert(
        getUserData({ isAdmin: true })
      );
      const token = getToken({ sub: authUser.sub });

      const user = await UserModel.query().insert(getUserData());

      const response = await supertest(app)
        .get(`${BASE_PATH}/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.id).toBe(user.id);
      expect(response.body.user.name).toBe(user.name);
      expect(response.body.user.email).toBe(user.email);
    });
  });

  describe(`PUT /api/v1/users/:userId`, () => {
    it('should respond with an error if token not provided', async () => {
      const response = await supertest(app).patch(`${BASE_PATH}/123`);

      expect(response.statusCode).toBe(401);
    });

    it('should respond with an error if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .patch(`${BASE_PATH}/123`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should respond with an error if req body does not pass schema validation', async () => {
      const authUser = await UserModel.query().insert(
        getUserData({ isAdmin: true })
      );
      const token = getToken({ sub: authUser.sub });

      const user = await UserModel.query().insert(getUserData());

      const body = {
        email: 'this-is-invalid-email',
        name: '',
      };

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.statusCode).toBe(422);
    });

    it('should respond with 404 if user does not exists', async () => {
      const authUser = await UserModel.query().insert(
        getUserData({ isAdmin: true })
      );
      const token = getToken({ sub: authUser.sub });

      const body = {
        email: 'newemail@test.com',
        name: 'John Doe',
      };

      const response = await supertest(app)
        .patch(`${BASE_PATH}/123`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.statusCode).toBe(404);
    });

    it('should update and respond with a user', async () => {
      const authUser = await UserModel.query().insert(
        getUserData({ isAdmin: true })
      );
      const token = getToken({ sub: authUser.sub });

      const user = await UserModel.query().insert(getUserData());

      const body = {
        email: 'newemail@test.com',
        name: 'John Doe',
      };

      const response = await supertest(app)
        .patch(`${BASE_PATH}/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.id).toBe(user.id);
      expect(response.body.user.email).toBe(body.email);
      expect(response.body.user.name).toBe(body.name);
    });
  });

  describe(`DELETE /api/v1/users/:userId`, () => {
    it('should respond with an error if token not provided', async () => {
      const response = await supertest(app).delete(`${BASE_PATH}/123`);

      expect(response.statusCode).toBe(401);
    });

    it('should respond with an error if user is not authorized', async () => {
      const user = await UserModel.query().insert(getUserData());
      const token = getToken({ sub: user.sub });

      const response = await supertest(app)
        .delete(`${BASE_PATH}/123`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should respond with 404 if user does not exists', async () => {
      const authUser = await UserModel.query().insert(
        getUserData({ isAdmin: true })
      );
      const token = getToken({ sub: authUser.sub });

      const response = await supertest(app)
        .delete(`${BASE_PATH}/123`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });

    it('should delete and respond with a user', async () => {
      const authUser = await UserModel.query().insert(
        getUserData({ isAdmin: true })
      );
      const token = getToken({ sub: authUser.sub });

      const user = await UserModel.query().insert(getUserData());

      const response = await supertest(app)
        .delete(`${BASE_PATH}/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.id).toBe(user.id);
    });
  });
});
