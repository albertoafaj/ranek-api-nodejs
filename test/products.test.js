const request = require('supertest');
const app = require('../src/app');

const MAIN_ROUTE = '/v1/products';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJfcHJvZHVjdEBlbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMyJ9.thGSihWaYUNWqNvmTiHRKbTGr3Vf2OfppTuU-1HcKL8';

beforeAll(async () => {
  await app.db.migrate.rollback();
  await app.db.migrate.latest();
  await app.db.seed.run();
});

describe('Whe try get products', () => {
  test('should list all products', async () => {
    const result = await request(app)
      .get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body.length).toBe(10);
  });
  test('should list by id', async () => {
    const result = await request(app)
      .get(`${MAIN_ROUTE}/10000`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body.id).toBe(10000);
  });
  test('should list by user id', async () => {
    const result = await request(app)
      .get(`${MAIN_ROUTE}?userId=${10000}`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body[0].userId).toBe(10000);
  });
  test('should list all queries requested by each keyword passed in the query parameter keywords', async () => {
    const result = await request(app)
      .get(`${MAIN_ROUTE}?keywords=nOTEbook2%20rAneK`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body.length).toBe(2);
    expect(result.body[0].name).toBe('Notebook2');
    expect(result.body[1].name).toBe('Smartphone');
  });
  test('should divide the query by a limit number of products', async () => {
    const result = await request(app)
      .get(`${MAIN_ROUTE}?limit=3`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body).toHaveLength(3);
  });
  test('should divide the query by a limit number of products per page', async () => {
    const result = await request(app)
      .get(`${MAIN_ROUTE}?page=2&limit=3`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body).toHaveLength(3);
    expect(result.body[0].id).toBe(10003);
  });

  test('should divide the query into 9 products per page if the limit is not informed', async () => {
    const result = await request(app)
      .get(`${MAIN_ROUTE}?page=2`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body).toHaveLength(1);
    expect(result.body[0].id).toBe(10009);
  });

  test('should return in header field x-total-count', async () => {
    const result = await request(app)
      .get(`${MAIN_ROUTE}?page=2&limit=2`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.header).toHaveProperty('x-total-count');
    expect(result.header['x-total-count']).toBe('10');
  });
});
test('should ', async () => {

});
