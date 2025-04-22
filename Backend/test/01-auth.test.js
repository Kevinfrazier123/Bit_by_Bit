import request from 'supertest';
import app from '../index.js';

describe('Auth endpoints', () => {
  it('should reject bad login', async () => {
    await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .expect(200);
  });

 
});

describe('Auth endpoints', () => {
  it('should reject bad login', async () => {
    await request(app)
      .post('/auth/login')
      .send({ username: 'wrong', password: 'wrong' })
      .expect(404);
  });

  //more auth tests…
});
