const request = require('supertest');
const jwt = require('jwt-simple');
require('dotenv').config();
const app = require('../src/app');

let user;
let product;
const MAIN_ROUTE = '/v1/products';

beforeAll(async () => {
  await app.db('products').del();
  await app.db('users').del();
  user = await app.services.user.save({
    email: 'user_product@email.com',
    password: '123456',
  });
  user = { ...user[0] };
  user.password = '123456';
  user.token = jwt.encode({ id: user.id, email: user.email }, process.env.JWTSEC);
  // TODO save a product
  product = await app.services.product.save([{
    userId: user.id,
    name: 'Computador',
    price: 6999.99,
    description: 'Note DELL I7',
  },
  {
    userId: user.id,
    name: 'Notebook',
    price: 6999.99,
    description: 'DELL I7',
  },
  {
    userId: user.id,
    name: 'Notebook2',
    price: 7999.99,
    description: 'Notebook DELL I7 query d',
  },
  {
    userId: user.id,
    name: 'Smartphone',
    price: 7999.99,
    description: 'Smartphone query d',
  }]);
  product = { ...product[0] };
});

describe('Whe try get products', () => {
  test('should list all products', async () => {
    const result = await request(app)
      .get(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`);
    expect(result.status).toBe(200);
    expect(result.body.length).toBe(4);
  });
  test('should list by id', async () => {
    const result = await request(app)
      .get(`${MAIN_ROUTE}/${product.id}`)
      .set('authorization', `bearer ${user.token}`);
    expect(result.status).toBe(200);
    expect(result.body.id).toBe(product.id);
  });
  test('should list by user id', async () => {
    const result = await request(app)
      .get(`${MAIN_ROUTE}?userId=${user.id}`)
      .set('authorization', `bearer ${user.token}`);
    expect(result.status).toBe(200);
    expect(result.body[0].userId).toBe(user.id);
  });
  test('should list by query param keywords', async () => {
    const result = await request(app)
      .get(`${MAIN_ROUTE}?keywords=Note`)
      .set('authorization', `bearer ${user.token}`);
    console.log(result.body);
    expect(result.status).toBe(200);
    expect(result.body.length).toBe(3);
  });
  test('should list by limite of page vizualization', () => { });
  test('should return in header field x-total-count', () => { });
});
test('should ', () => {
});
