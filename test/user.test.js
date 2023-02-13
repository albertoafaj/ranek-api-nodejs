const request = require('supertest');
const app = require('../src/app');

const MAIN_ROTE = '/users';
let user;

beforeAll(async () => {
  const result = await app.services.user.save({
    name: 'User#0',
    email: `${Date.now()}@ranek.com`,
    password: '123456',
    status: true,
  });
  user = { ...result[0] };
  user.password = '123456';
});

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

// TODO not allow inserting fields other than (name, e-mail, password);

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
test('Should not update the fields to null', async () => {
  const result = await request(app)
    .put(`${MAIN_ROTE}/${user.id}`)
    .send({
      name: null,
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('O campo nome é um atributo obrigatório');
});
test('Should not update email', async () => {
  const result = await request(app)
    .put(`${MAIN_ROTE}/${user.id}`)
    .send({
      email: `${user.email}updated`,
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('O campo email não pode ser alterado');
});
test('Should not update id', async () => {
  const result = await request(app)
    .put(`${MAIN_ROTE}/${user.id}`)
    .send({
      id: `${user.id}updated`,
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('O campo id não pode ser alterado');
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

test('should not update zip code to a number with a different length of eight characters', async () => {
  const result = await request(app)
    .put(`${MAIN_ROTE}/${user.id}`)
    .send({
      zipCode: '1234567',
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('O código postal deve ser preenchido com uma sequência de oito números');
});

test('Should not update zip code when dont input just numbers', async () => {
  const result = await request(app)
    .put(`${MAIN_ROTE}/${user.id}`)
    .send({
      zipCode: 'ABCDEFGH',
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('O código postal deve ser preenchido com uma sequência de oito números');
});

test('should not update street to more than 50 characters', async () => {
  const result = await request(app)
    .put(`${MAIN_ROTE}/${user.id}`)
    .send({
      street: '012345678901234567890123456789012345678901234567891',
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('O campo rua não deve ter mais de 50 caracteres');
});

test('should not update status if not a bollean', async () => {
  const result = await request(app)
    .put(`${MAIN_ROTE}/${user.id}`)
    .send({
      status: 'string',
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('O campo status deve ser um boleano, passe o atributo(true or false)');
});

test('should not update number to more than 8 characters', async () => {
  const result = await request(app)
    .put(`${MAIN_ROTE}/${user.id}`)
    .send({
      number: '1234567890',
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('O campo número não deve ter mais de 8 caracteres');
});
test('should not update number if not a string', async () => {
  const result = await request(app)
    .put(`${MAIN_ROTE}/${user.id}`)
    .send({
      number: 12345,
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('O campo número deve ser um(a) string');
});
// not null - OK
// validation primary not update
// validation fields unique
// validation of length field
// validation type field
/*
t.increments('id').primary();
t.string('name').notNull();
t.string('email').notNull().unique();
t.string('password').notNull();
t.boolean('status').notNull().default(true);
t.timestamp('dateCreate', { useTz: true }).notNull().defaultTo(knex.fn.now());
t.timestamp('dateLastUpdate', { useTz: true });
t.string('street', 50);
t.string('number', 8);
t.string('city', 50);
t.string('state', 2);
t.integer('zipCode', 8);
t.string('district', 50);
*/
