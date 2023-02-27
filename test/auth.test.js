const request = require('supertest');
const app = require('../src/app');

const MAIN_ROTE = '/auth/signin';

beforeAll(async () => {
  await app.db('users').del();
});

describe('when try loggin', () => {
  const testTemplate = async (savePass, logginPass) => {
    const email = `${Date.now()}@token.com`;
    await app.services.user.save({
      email,
      password: savePass,
    });
    const result = await request(app)
      .post(MAIN_ROTE)
      .send({
        email,
        password: logginPass,
      });
    return result;
  };
  test('should received token', async () => {
    const result = await testTemplate('123456', '123456');
    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty('token');
  });
  test('should not login user with wrong password', async () => {
    const result = await testTemplate('123456', '123457');
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Usuário ou senha inválido');
  });
  test('should not login non-existent user', async () => {
    const result = await request(app).post(MAIN_ROTE).send({
      email: 'non-existent@user.com',
      password: '123456',
    });
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Usuário ou senha inválido');
  });
  test('should not login without email', async () => {
    const result = await request(app).post(MAIN_ROTE).send({
      password: '123456',
    });
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Usuário ou senha inválido');
  });
  test('should not login without password', async () => {
    const result = await request(app).post(MAIN_ROTE).send({
      email: 'non-existent@user.com',
    });
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Usuário ou senha inválido');
  });
});

describe('when try create a user', () => {
  test('should return email prop and not passwoed', async () => {
    const user = {
      email: 'signup@user',
      password: '123456',
    };
    const result = await request(app).post('/auth/signup')
      .send(user);
    expect(result.status).toBe(201);
    expect(result.body).toHaveProperty('email');
    expect(result.body).not.toHaveProperty('password');
  });
});

test('should not access protect route', async () => {
  const users = await request(app).get('/users');
  expect(users.status).toBe(401);
});
