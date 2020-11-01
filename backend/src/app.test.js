import supertest from 'supertest';
import { app } from './app';
import { getToken } from './utils/fixtures';

describe('Test the app endpoint', () => {
  describe('GET /api/auth', () => {
    it('should fail without token', async () => {
      const response = await supertest(app).get('/api/auth');

      expect(response.statusCode).toBe(401);
    });

    it('should respond with a message', async () => {
      const token = getToken();

      const response = await supertest(app)
        .get('/api/auth')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
    });
  });
});
