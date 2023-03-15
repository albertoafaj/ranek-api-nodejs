const request = require('supertest');
const app = require('../src/app');

const MAIN_ROUTE = '/v1/transactions';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJfcHJvZHVjdEBlbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMyJ9.thGSihWaYUNWqNvmTiHRKbTGr3Vf2OfppTuU-1HcKL8';



beforeAll(async () => {
  await app.db.migrate.rollback();
  await app.db.migrate.latest();
  await app.db.seed.run();
});


describe('Whe try save a transaction', () => {
  const templatePost = async (status, body, errorMsg) => {
    const result = await request(app)
      .post(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .send(body);
    expect(result.status).toBe(status);
    if (result.error) expect(result.body.error).toBe(errorMsg);
    return result;
  };
  const transaction = {
    productId: 10001,
    addressId: {
      street: 'Rua transactions post',
      number: '123456',
      city: 'Cidade post',
      state: 'BA',
      zipCode: 12345678,
      district: 'Bairro post',
    },
  };
  test('should return status 200', async () => {
    const result = await templatePost(200, transaction, '');
    expect(result.body).toHaveProperty('id');
    expect(result.body.buyerId).toBe(10000);
    expect(result.body.productId).toBe(10001);
    expect(result.body).toHaveProperty('addressId');
    expect(result.body).toHaveProperty('dateCreate');
    expect(result.body.dateLastUpdate).toBeNull();
  });
  test('the buyerId field should not be null', async () => templatePost(400, { ...transaction, buyerId: null }, 'O campo comprador é um atributo obrigatório'));
  test('the productId field should not be null', async () => templatePost(400, { ...transaction, productId: null }, 'O campo produto é um atributo obrigatório'));
  test('the addressId field should not be null', async () => templatePost(400, { ...transaction, addressId: null }, 'O campo endereço é um atributo obrigatório'));
  test('the buyerId field should be a number', async () => templatePost(400, { ...transaction, buyerId: '1234' }, 'O campo comprador deve ser um(a) number'));
  test('the productId field should be a number', async () => templatePost(400, { ...transaction, productId: '1234' }, 'O campo produto deve ser um(a) number'));
  test('the productId field should be a number', async () => templatePost(400, { ...transaction, productId: '1234' }, 'O campo endereço deve ser um(a) number'));
  test('the product should belong to the user', async () => templatePost(400, { ...transaction, userId: 10000 }, 'O usuário não pode comprar seus próprios produtos'));
  test('the buyerId if should be from the logged in user ', async () => templatePost(400, { ...transaction, buyerId: 10000 }, 'Este recurso não pertence ao usuário'));
});

describe('Whe try get a transaction', () => {
  test('should list by id', async () => {
    const result = await request(app)
      .get(`${MAIN_ROUTE}/10000`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body.id).toBe(10000);
    expect(result.body.buyerId).toBe(10000);
    // TODO check if it would be better to return user email instead of id
    expect(result.body.product.name).toBe('Computador transactions');
    expect(result.body.address.street).toBe('Rua transactions');

  });
});

describe('when try update transaction', () => {
  const templateUpdate = async (status, body, errorMsg, transactionId) => {
    const result = await request(app)
      .put(`${MAIN_ROUTE}/${transactionId}`)
      .set('authorization', `bearer ${TOKEN}`)
      .send(body);
    console.log(result.error.message);
    console.log(result.body);
    expect(result.status).toBe(status);
    if (result.error) expect(result.body.error).toBe(errorMsg);
    return result;
  };
  const transaction = {
    productId: 10002,
    addressId: {
      street: 'Rua transactions Update',
      number: '123456',
      city: 'Cidade Update',
      state: 'BA',
      zipCode: 12345678,
      district: 'Bairro Update',
    },
  };

  test('should return status 200', async () => {
    const result = await templatePost(200, transaction, '');
    expect(result.body).toBe(10000);
    expect(result.body.buyerId).toBe(10000);
    expect(result.body.productId).toBe(10002);
    expect(result.body.addressId).toHaveProperty('Rua transactions Update');
    expect(result.body).toHaveProperty('dateCreate');
    expect(result.body.dateLastUpdate).not.toBeNull();
  });
  test('the buyerId field should not be null', async () => templatePost(400, { ...transaction, buyerId: null }, 'O campo comprador é um atributo obrigatório', 10000));
  test('the productId field should not be null', async () => templatePost(400, { ...transaction, productId: null }, 'O campo produto é um atributo obrigatório', 10000));
  test('the addressId field should not be null', async () => templatePost(400, { ...transaction, addressId: null }, 'O campo endereço é um atributo obrigatório', 10000));
  test('the buyerId field should be a number', async () => templatePost(400, { ...transaction, buyerId: '1234' }, 'O campo comprador deve ser um(a) number', 10000));
  test('the productId field should be a number', async () => templatePost(400, { ...transaction, productId: '1234' }, 'O campo produto deve ser um(a) number', 10000));
  test('the productId field should be a number', async () => templatePost(400, { ...transaction, productId: '1234' }, 'O campo endereço deve ser um(a) number', 10000));
  test('the product should belong to the user', async () => templatePost(400, { ...transaction, userId: 10000 }, 'O usuário não pode comprar seus próprios produtos', 10000));
  test('the buyerId if should be from the logged in user ', async () => templatePost(400, { ...transaction, buyerId: 10000 }, 'Este recurso não pertence ao usuário', 10000));

});

describe('when try delete a transaction', () => {
  test('should remove a transaction', async () => {
    const result = await request(app)
      .delete(`${MAIN_ROUTE}/10000`)
      .set('authorization', `bearer ${TOKEN}`);
    console.log(result.error.message);
    expect(result.status).toBe(204);
  });
});