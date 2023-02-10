const request = require('supertest');

const app = require('../src/app');

const email = `${Date.now()}@ranek.com`;

test('Should to list all users', async () => {
  const result = await request(app).get('/users');
  expect(result.status).toBe(200);
  expect(result.body.length).toBeGreaterThan(0);
});

test('Should insert a user with sucess', async () => {
  const result = await request(app)
    .post('/users')
    .send({
      name: 'Steve Rogers',
      email,
      password: '123',
    });
  expect(result.status).toBe(201);
  expect(result.body.name).toBe('Steve Rogers');
  expect(result.body).not.toHaveProperty('password');
});
test('should insert a crypt password', async () => {
  const result = await request(app)
    .post('/users')
    .send({
      name: 'Steve Rogers',
      email: `${Date.now()}@ranek.com`,
      password: '123',
    });
  expect(result.status).toBe(201);
  const userDB = await app.services.user.findOne(result.body);
  expect(userDB.password).not.toBeUndefined();
  expect(userDB.password).not.toBe('123');
});

test('should not insert user without name', async () => {
  const result = await request(app)
    .post('/users')
    .send({
      email,
      password: '123',
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Nome é um atributo obrigatório');
});
test('should not insert user without email', async () => {
  const result = await request(app)
    .post('/users')
    .send({
      name: 'Steve Rogers',
      password: '123',
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('O e-mail é um atributo obrigatório');
});

test('should not insert user without password', async () => {
  const result = await request(app)
    .post('/users')
    .send({
      name: 'Steve Rogers',
      email,
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('A senha é um atributo obrigatório');
});

test('should not insert user with registered email', async () => {
  const result = await request(app)
    .post('/users')
    .send({
      name: 'Steve Rogers',
      email,
      password: '123',
    });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Já existe um usuário com este email');
});

// TODO create user data update rules;

test.skip('Should update users data', async () => {

});
