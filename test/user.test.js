const request = require('supertest');
const app = require('../src/app');

const MAIN_ROTE = '/users';
let user;

beforeAll(async () => {
  await app.db('users').del();
  const result = await app.services.user.save({
    name: 'User#0',
    email: `${Date.now()}@ranek.com`,
    password: '123456',
    status: true,
  });
  user = { ...result[0] };
  user.password = '123456';
});

const testTemplateUpdate = async (newData, errorMessage) => {
  const result = await request(app)
    .put(`${MAIN_ROTE}/${user.id}`)
    .send({ ...newData });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe(errorMessage);
};

test('Should to list all users', async () => {
  const result = await request(app).get('/users');
  expect(result.status).toBe(200);
  expect(result.body.length).toBeGreaterThan(0);
});

test('Should insert a user with sucess', async () => {
  const result = await request(app)
    .post(MAIN_ROTE)
    .send({
      name: 'Steve Rogers',
      email: `${Date.now()}@ranek.com`,
      password: '123456',
    });
  expect(result.status).toBe(201);
  expect(result.body.name).toBe('Steve Rogers');
  expect(result.body).not.toHaveProperty('password');
  expect(result.body.status).toBe(true);
  expect(result.body).toHaveProperty('dateCreate');
});
test('should insert a crypt password', async () => {
  const result = await request(app)
    .post(MAIN_ROTE)
    .send({
      name: 'user#CRIPT',
      email: `${Date.now()}@ranek.com`,
      password: '123456',
    });
  expect(result.status).toBe(201);
  const userDB = await app.services.user.findOne(result.body);
  expect(userDB.password).not.toBeUndefined();
  expect(userDB.password).not.toBe('123');
});

// TODO not allow inserting fields other than (e-mail, password);

test('should not insert user without name', async () => {
  const result = await request(app)
    .post(MAIN_ROTE)
    .send({
      email: user.email,
      password: user.password,
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Nome é um atributo obrigatório');
});
test('should not insert user without email', async () => {
  const result = await request(app)
    .post(MAIN_ROTE)
    .send({
      name: user.name,
      password: user.password,
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('O e-mail é um atributo obrigatório');
});

test('should not insert user without password', async () => {
  const result = await request(app)
    .post(MAIN_ROTE)
    .send({
      name: user.name,
      email: user.email,
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('A senha é um atributo obrigatório');
});

test('should not insert user with registered email', async () => {
  const result = await request(app)
    .post(MAIN_ROTE)
    .send(user);
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Já existe um usuário com este email');
});

test('Should update a users', async () => {
  const result = await request(app)
    .put(`${MAIN_ROTE}/${user.id}`)
    .send({
      street: 'Rua Ali perto',
      number: '1200',
      city: 'Camaçari',
      state: 'BA',
      zipCode: 12345678,
      district: 'Arembepe',
      status: false,
    });
  expect(result.status).toBe(200);
  expect(result.body.name).toBe('User#0');
  expect(result.body.email).toBe(user.email);
  expect(result.body.status).toBe(false);
  expect(result.body).toHaveProperty('dateCreate');
  expect(result.body.dateLastUpdate).not.toBeNull();
  expect(result.body.street).toBe('Rua Ali perto');
  expect(result.body.number).toBe('1200');
  expect(result.body.city).toBe('Camaçari');
  expect(result.body.state).toBe('BA');
  expect(result.body.zipCode).toBe(12345678);
  expect(result.body.district).toBe('Arembepe');
});

test('should update a crypt password', async () => {
  const result = await request(app)
    .put(`${MAIN_ROTE}/${user.id}`)
    .send({
      password: '123',
    });
  expect(result.status).toBe(200);
  const userDB = await app.services.user.findOne(result.body);
  expect(userDB.password).not.toBeUndefined();
  expect(userDB.password).not.toBe('1234567890');
});

describe('when try to update the fields to null', () => {
  test('Should not update the id', () => testTemplateUpdate({ id: null }, 'O campo id é um atributo obrigatório'));
  test('Should not update the name', () => testTemplateUpdate({ name: null }, 'O campo nome é um atributo obrigatório'));
  test('Should not update the email', () => testTemplateUpdate({ email: null }, 'O campo email é um atributo obrigatório'));
  test('Should not update the status', () => testTemplateUpdate({ status: null }, 'O campo status é um atributo obrigatório'));
  test('Should not update the dateCreate', () => testTemplateUpdate({ dateCreate: null }, 'O campo data de criação é um atributo obrigatório'));
  test('Should not update the dateLastUpdate', () => testTemplateUpdate({ dateLastUpdate: null }, 'O campo data de atualização é um atributo obrigatório'));
  test('Should not update the street', () => testTemplateUpdate({ street: null }, 'O campo rua é um atributo obrigatório'));
  test('Should not update the number', () => testTemplateUpdate({ number: null }, 'O campo número é um atributo obrigatório'));
  test('Should not update the city', () => testTemplateUpdate({ city: null }, 'O campo cidade é um atributo obrigatório'));
  test('Should not update the state', () => testTemplateUpdate({ state: null }, 'O campo estado é um atributo obrigatório'));
  test('Should not update the zipCode', () => testTemplateUpdate({ zipCode: null }, 'O campo código postal é um atributo obrigatório'));
  test('Should not update the district', () => testTemplateUpdate({ district: null }, 'O campo bairro é um atributo obrigatório'));
});
describe('when trying to update unique fields', () => {
  test('Should not update the id', () => testTemplateUpdate({ id: `${user.id}updated` }, 'O campo id não pode ser alterado'));
  test('Should not update the email', () => testTemplateUpdate({ email: `${user.email}updated` }, 'O campo email não pode ser alterado'));
});

describe('when trying to update fields that have the same min and max length', () => {
  test('Should not update the state', () => testTemplateUpdate({ state: 'B' }, 'O campo estado deve ter 2 caracteres'));
  test('Should not update the zipCode', () => testTemplateUpdate({ zipCode: 1234567 }, 'O campo código postal deve ter 8 caracteres'));
});

describe('when try to update the fields to incorrect type', () => {
  test('Should not update the name', () => testTemplateUpdate({ name: 123 }, 'O campo nome deve ser um(a) string'));
  test('Should not update the status', () => testTemplateUpdate({ status: 123 }, 'O campo status deve ser um(a) boolean'));
  test('Should not update the dateCreate', () => testTemplateUpdate({ dateCreate: 123 }, 'O campo data de criação deve ser um(a) string'));
  test('Should not update the dateLastUpdate', () => testTemplateUpdate({ dateLastUpdate: 123 }, 'O campo data de atualização deve ser um(a) string'));
  test('Should not update the street', () => testTemplateUpdate({ street: 123 }, 'O campo rua deve ser um(a) string'));
  test('Should not update the number', () => testTemplateUpdate({ number: 12 }, 'O campo número deve ser um(a) string'));
  test('Should not update the city', () => testTemplateUpdate({ city: 12 }, 'O campo cidade deve ser um(a) string'));
  test('Should not update the state', () => testTemplateUpdate({ state: 12 }, 'O campo estado deve ser um(a) string'));
  test('Should not update the zipCode', () => testTemplateUpdate({ zipCode: 'ABCDEFGH' }, 'O campo código postal deve ser um(a) number'));
  test('Should not update the district', () => testTemplateUpdate({ district: 12 }, 'O campo bairro deve ser um(a) string'));
});

describe('when trying to update fields to values less than or greater than the preset', () => {
  const stringGenaretor = (length) => {
    const arr = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      arr.push('A');
    }
    return arr.reduce((acc, cur) => acc + cur);
  };
  test('Should not update the name', () => testTemplateUpdate({ name: stringGenaretor(256) }, 'O campo nome deve ter de 0 a 255 caracteres'));
  test('Should not update the street', () => testTemplateUpdate({ street: stringGenaretor(256) }, 'O campo rua deve ter de 0 a 255 caracteres'));
  test('Should not update the number', () => testTemplateUpdate({ number: stringGenaretor(9) }, 'O campo número deve ter de 0 a 8 caracteres'));
  test('Should not update the city', () => testTemplateUpdate({ city: stringGenaretor(51) }, 'O campo cidade deve ter de 0 a 50 caracteres'));
  test('Should not update the district', () => testTemplateUpdate({ district: stringGenaretor(51) }, 'O campo bairro deve ter de 0 a 50 caracteres'));
});
