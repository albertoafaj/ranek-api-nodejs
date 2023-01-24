const request = require('supertest');

const app = require('../src/app');

test('should respond on port 3001', async () => {
  const res = await request(app).get('/');
  expect(res.status).toBe(200);
});
