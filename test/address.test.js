const request = require('supertest');
const app = require('../src/app');

const MAIN_ROUTE = '/v1/address';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJfcHJvZHVjdEBlbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMyJ9.thGSihWaYUNWqNvmTiHRKbTGr3Vf2OfppTuU-1HcKL8';

const stringGenaretor = (length) => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push('A');
  }
  return arr.reduce((acc, cur) => acc + cur);
};

beforeAll(async () => {
  await app.db.migrate.rollback();
  await app.db.migrate.latest();
  await app.db.seed.run();
});
describe('Whe try save address', () => {
  test('should list by id', async () => {
    const result = await request(app)
      .get(`${MAIN_ROUTE}/10000`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(200);
    expect(result.body.id).toBe(10000);
  });
});

describe('Whe try salve address', () => {
  const templatePost = async (status, body, errorMsg) => {
    const result = await request(app)
      .post(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .send(body);
    expect(result.status).toBe(status);
    if (result.error) expect(result.body.error).toBe(errorMsg);
    return result;
  };
  const address = {
    street: 'Rua B',
    number: '5432',
    city: 'Cidade Dois',
    state: 'BA',
    zipCode: 12345678,
    district: 'Bairro Dois',
  };
  test('should return status 200', async () => {
    const result = await templatePost(200, address, '');
    expect(result.body).toHaveProperty('id');
    expect(result.body.street).toBe('Rua B');
    expect(result.body.city).toBe('Cidade Dois');
    expect(result.body.state).toBe('BA');
    expect(result.body.zipCode).toBe(12345678);
    expect(result.body.district).toBe('Bairro Dois');
    expect(result.body).toHaveProperty('dateCreate');
    expect(result.body).toBeNull();
  });
  test('the street field should be null', async () => templatePost(400, { ...address, street: null }, 'O campo rua deve ser um(a) string'));
  test('the number field should be null', async () => templatePost(400, { ...address, number: null }, 'O campo número deve ser um(a) string'));
  test('the city field should be null', async () => templatePost(400, { ...address, city: null }, 'O campo cidade deve ser um(a) string'));
  test('the state field should be null', async () => templatePost(400, { ...address, state: null }, 'O campo estado deve ser um(a) string'));
  test('the zipCode field should be null', async () => templatePost(400, { ...address, zipCode: null }, 'O campo código postal deve ser um(a) bumber'));
  test('the district field should be null', async () => templatePost(400, { ...address, district: null }, 'O campo bairro deve ser um(a) string'));
  test('the street field should be a string', async () => templatePost(400, { ...address, street: 123456 }, 'O campo rua deve ser um(a) string'));
  test('the number field should be a string', async () => templatePost(400, { ...address, number: 123456 }, 'O campo número deve ser um(a) string'));
  test('the city field should be a string', async () => templatePost(400, { ...address, city: 123456 }, 'O campo cidade deve ser um(a) string'));
  test('the state field should be a string', async () => templatePost(400, { ...address, state: 12 }, 'O campo estado deve ser um(a) string'));
  test('the zipCode field should be a number', async () => templatePost(400, { ...address, zipCode: '123456' }, 'O campo código postal deve ser um(a) bumber'));
  test('the district field should be a string', async () => templatePost(400, { ...address, district: 123456 }, 'O campo bairro deve ser um(a) string'));
  describe('when trying to update fields that have the same min and max length', () => {
    test('Should not update the state', () => templatePost(400, { ...address, state: 'B' }, 'O campo estado deve ter 2 caracteres'));
    test('Should not update the zipCode', () => templatePost(400, { ...address, zipCode: 1234567 }, 'O campo código postal deve ter 8 caracteres'));
  });
  test('the street should not have values smaller or larger than the preset', () => templatePost(400, { ...address, street: stringGenaretor(256) }, 'O campo rua deve ter de 0 a 255 caracteres'));
  test('the number should not have values smaller or larger than the preset', () => templatePost(400, { ...address, number: stringGenaretor(9) }, 'O campo número deve ter de 0 a 8 caracteres'));
  test('the city should not have values smaller or larger than the preset', () => templatePost(400, { ...address, city: stringGenaretor(51) }, 'O campo cidade deve ter de 0 a 50 caracteres'));
  test('the district should not have values smaller or larger than the preset', () => templatePost(400, { ...address, district: stringGenaretor(51) }, 'O campo bairro deve ter de 0 a 50 caracteres'));
});

describe('when try update address', () => {
  const templateUpdate = async (status, body, errorMsg, adressId) => {
    const result = await request(app)
      .put(`${MAIN_ROUTE}/${adressId}`)
      .set('authorization', `bearer ${TOKEN}`)
      .send(body);
    console.log(result.error);
    expect(result.status).toBe(status);
    if (result.error) expect(result.body.error).toBe(errorMsg);
    return result;
  };
  const address = {
    street: 'Rua B Updated',
    number: '5432 Updated',
    city: 'Cidade Dois Updated',
    state: 'SE',
    zipCode: 87654321,
    district: 'Bairro Dois Updated',
  };
  test('should return status 200', async () => {
    const result = await templateUpdate(200, address, '', 10000);
    expect(result.body).toHaveProperty('id Updated');
    expect(result.body.street).toBe('Rua B Updated');
    expect(result.body.city).toBe('Cidade Dois Updated');
    expect(result.body.state).toBe('SE');
    expect(result.body.zipCode).toBe(87654321);
    expect(result.body.district).toBe('Bairro Dois Updated');
    expect(result.body).toHaveProperty('dateCreate');
    expect(result.body).not.toBeNull();
  });
  test('the street field should be null', async () => templatePost(400, { ...address, street: null }, 'O campo rua deve ser um(a) string', 10000));
  test('the number field should be null', async () => templatePost(400, { ...address, number: null }, 'O campo número deve ser um(a) string', 10000));
  test('the city field should be null', async () => templatePost(400, { ...address, city: null }, 'O campo cidade deve ser um(a) string', 10000));
  test('the state field should be null', async () => templatePost(400, { ...address, state: null }, 'O campo estado deve ser um(a) string', 10000));
  test('the zipCode field should be null', async () => templatePost(400, { ...address, zipCode: null }, 'O campo código postal deve ser um(a) bumber', 10000));
  test('the district field should be null', async () => templatePost(400, { ...address, district: null }, 'O campo bairro deve ser um(a) string', 10000));
  test('the street field should be a string', async () => templatePost(400, { ...address, street: 123456 }, 'O campo rua deve ser um(a) string', 10000));
  test('the number field should be a string', async () => templatePost(400, { ...address, number: 123456 }, 'O campo número deve ser um(a) string', 10000));
  test('the city field should be a string', async () => templatePost(400, { ...address, city: 123456 }, 'O campo cidade deve ser um(a) string', 10000));
  test('the state field should be a string', async () => templatePost(400, { ...address, state: 12 }, 'O campo estado deve ser um(a) string', 10000));
  test('the zipCode field should be a number', async () => templatePost(400, { ...address, zipCode: '123456' }, 'O campo código postal deve ser um(a) bumber', 10000));
  test('the district field should be a string', async () => templatePost(400, { ...address, district: 123456 }, 'O campo bairro deve ser um(a) string', 10000));
  describe('when trying to update fields that have the same min and max length', () => {
    test('Should not update the state', () => templatePost(400, { ...address, state: 'B' }, 'O campo estado deve ter 2 caracteres', 10000));
    test('Should not update the zipCode', () => templatePost(400, { ...address, zipCode: 1234567 }, 'O campo código postal deve ter 8 caracteres', 10000));
  });
  test('the street should not have values smaller or larger than the preset', () => templatePost(400, { ...address, street: stringGenaretor(256) }, 'O campo rua deve ter de 0 a 255 caracteres', 10000));
  test('the number should not have values smaller or larger than the preset', () => templatePost(400, { ...address, number: stringGenaretor(9) }, 'O campo número deve ter de 0 a 8 caracteres', 10000));
  test('the city should not have values smaller or larger than the preset', () => templatePost(400, { ...address, city: stringGenaretor(51) }, 'O campo cidade deve ter de 0 a 50 caracteres', 10000));
  test('the district should not have values smaller or larger than the preset', () => templatePost(400, { ...address, district: stringGenaretor(51) }, 'O campo bairro deve ter de 0 a 50 caracteres', 10000));

});

describe('when try delete a address', () => {
  test('should remove a address', async () => {
    const result = await request(app)
      .delete(`${MAIN_ROUTE}/10000`)
      .set('authorization', `bearer ${TOKEN}`);
    console.log(result.error.message);
    expect(result.status).toBe(204);
  });
});