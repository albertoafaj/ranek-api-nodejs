const request = require('supertest');
const app = require('../src/app');

test('Should to list all users', async () => {
  const result = await request(app).get('/users');
  expect(result.status).toBe(200);
  expect(result.body).toHaveLength(1);
  expect(result.body[0]).toHaveProperty('name', 'Steve Rogers');
});

test('Should insert a user with sucess', async () => {
  const result = await request(app)
    .post('/users')
    .send({
      name: 'Steve Rogers',
      email: `${Date.now()}@ranek.com`,
      password: '123',
    });
  expect(result.status).toBe(201);
  expect(result.body.name).toBe('Steve Rogers');
});
