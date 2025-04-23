// test/01-auth.test.js

import request from 'supertest';
import app from '../index.js';

describe('Auth Endpoints', () => {
  // Register test user before running login tests
  beforeAll(async () => {
    await request(app).post('/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword'
    });
  });

  it('should reject invalid login with 404', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'wrong', password: 'wrong' });

    expect(response.status).toBe(404);
  });

  it('should reject missing credentials with 400', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({});
    expect(response.status).toBe(400);
  });

  it('should return 400 if username is missing', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ password: 'testpassword' });

    expect(response.status).toBe(400);
  });

  it('should return 400 if password is missing', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser' });

    expect(response.status).toBe(400);
  });

  it('should login successfully with correct credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should create a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: `user_${Date.now()}`,
        email: `email_${Date.now()}@test.com`,
        password: 'securepass'
      });

    expect(response.status).toBe(200);
  });

  it('should reject signup with short password', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'failuser',
        email: 'fail@user.com',
        password: '123'
      });

    expect(response.status).toBe(400);
  });

  it('should return 404 for an unknown route', async () => {
    const response = await request(app).get('/nonexistent-route');
    expect(response.status).toBe(404);
  });

  it('should return 404 or 405 for unsupported method', async () => {
    const response = await request(app)
      .put('/auth/login')
      .send({});
    expect([404, 405]).toContain(response.status);
  });
});
