const supertest = require('supertest');

const port = 3001;
const url = `http://localhost:${port}`;
const request = supertest(url);

test('should respond on port 3001', async () => {
  const res = await request.get('/');
  expect(res.status).toBe(200);
});
