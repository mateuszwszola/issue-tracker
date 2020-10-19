import { app } from '../app';
import db from '../db';
import supertest from 'supertest';
import setupTest from '../setupTests';
import teardownTest from '../teardownTests';

describe('User routes', () => {
  const thisDb = db;

  beforeAll(() => setupTest(thisDb));

  afterAll(() => teardownTest(thisDb));
});
