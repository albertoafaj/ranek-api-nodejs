const request = require('supertest');
const app = require('../src/app');

const MAIN_ROUTE = '/v1/products';
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

describe('Whe try get products', () => {
  const templateGet = async (urlQuery, status, errorMsg) => {
    const result = await request(app)
      .get(`${MAIN_ROUTE}/${urlQuery}`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(status);
    if (result.error) expect(result.error.message).toBe(errorMsg);
    return result;
  };
  test('should list all products', async () => {
    const result = await templateGet('', 200, '');
    expect(result.body.length).toBe(10);
  });
  test('should list by id', async () => {
    const result = await templateGet(10000, 200, '');
    expect(result.body.id).toBe(10000);
  });
  test('should list by user id', async () => {
    const result = await templateGet('?userId=10000', 200, '');
    expect(result.body[0].userId).toBe(10000);
  });
  test('should list all queries requested by each keyword passed in the query parameter keywords', async () => {
    const result = await templateGet('?keywords=nOTEbook2%20rAneK', 200, '');
    expect(result.body.length).toBe(2);
    expect(result.body[0].name).toBe('Notebook2');
    expect(result.body[1].name).toBe('Smartphone');
  });
  test('should divide the query by a limit number of products', async () => {
    const result = await templateGet('?limit=3', 200, '');
    expect(result.body).toHaveLength(3);
  });
  test('should divide the query by a limit number of products per page', async () => {
    const result = await templateGet('?page=2&limit=3', 200, '');
    expect(result.body).toHaveLength(3);
    expect(result.body[0].id).toBe(10003);
  });
  test('should divide the query into 9 products per page if the limit is not informed', async () => {
    const result = await templateGet('?page=2', 200, '');
    expect(result.body).toHaveLength(1);
    expect(result.body[0].id).toBe(10009);
  });

  test('should return in header field x-total-count', async () => {
    const result = await templateGet('?page=2&limit=2', 200, '');
    expect(result.header).toHaveProperty('x-total-count');
    expect(result.header['x-total-count']).toBe('10');
  });
});

describe('Whe try salve products', () => {
  const templatePost = async (status, body, errorMsg) => {
    const result = await request(app)
      .post(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .send(body);
    expect(result.status).toBe(status);
    if (result.error) expect(result.body.error).toBe(errorMsg);
    return result;
  };
  const product = {
    name: 'Phone de Ouvido - Salvar',
    price: 199.99,
    description: 'Phone de Ouvido - Teste salvar produtos',
  };
  test('should return status 200', async () => {
    const result = await templatePost(200, product, '');
    expect(result.body).toHaveProperty('id');
    expect(result.body.userId).toBe(10000);
    expect(result.body.name).toBe('Phone de Ouvido - Salvar');
    expect(result.body.price).toBe(199.99);
    expect(result.body).toHaveProperty('sold', false);
    expect(result.body).toHaveProperty('description');
    expect(result.body).toHaveProperty('photos');
    expect(result.body).toHaveProperty('dateCreate');
    expect(result.body).toHaveProperty('dateLastUpdate');
  });
  test('the name field should not be null', async () => {
    await templatePost(400, { ...product, name: null }, 'O campo nome é um atributo obrigatório');
  });
  test('the price field should not be null', async () => {
    await templatePost(400, { ...product, price: null }, 'O campo preço é um atributo obrigatório');
  });
  test('the description field should not be null', async () => {
    await templatePost(400, { ...product, description: null }, 'O campo descrição é um atributo obrigatório');
  });
  test('the name field should be a string', async () => {
    await templatePost(400, { ...product, name: true }, 'O campo nome deve ser um(a) string');
  });
  test('the price field should be a number', async () => {
    await templatePost(400, { ...product, price: 'money' }, 'O campo preço deve ser um(a) number');
  });
  test('the description field should be a string', async () => {
    await templatePost(400, { ...product, description: true }, 'O campo descrição deve ser um(a) string');
  });
  // TODO Create a photo entity and separate the products
  test('the photos field should be a binary', async () => {
    await templatePost(400, { ...product, photos: { file: 'products photos' } }, 'O campo fotos deve ser um(a) Object');
  });
  // TODO should save photos with others lengths
  test('the name field should not have values smaller or larger than the preset', async () => {
    await templatePost(400, { ...product, name: stringGenaretor(266) }, 'O campo nome deve ter de 0 a 255 caracteres');
  });
  test('the description field should not have values smaller than the preset', async () => {
    await templatePost(400, { ...product, description: stringGenaretor(15) }, 'O campo descrição deve ter de 16 a 255 caracteres');
  });
  test('the description field should not have values larger than the preset', async () => {
    await templatePost(400, { ...product, description: stringGenaretor(266) }, 'O campo descrição deve ter de 16 a 255 caracteres');
  });
});

describe('when try update products', () => {
  const templateUpdate = async (status, body, errorMsg, product) => {
    const result = await request(app)
      .put(`${MAIN_ROUTE}/${product}`)
      .set('authorization', `bearer ${TOKEN}`)
      .send(body);
    console.log(result.error);
    expect(result.status).toBe(status);
    if (result.error) expect(result.body.error).toBe(errorMsg);
    return result;
  };
  const product = {
    name: 'Phone de Ouvido - updated',
    price: 399.99,
    description: 'Phone de Ouvido Techno query d - updated',
    sold: true,
  };
  test('should return status 200', async () => {
    const result = await templateUpdate(200, product, '', 10009);

    expect(result.body.id).toBe(10009);
    expect(result.body.userId).toBe(10000);
    expect(result.body.name).toBe('Phone de Ouvido - updated');
    expect(result.body.description).toBe('Phone de Ouvido Techno query d - updated');
    expect(result.body.price).toBe(399.99);
    expect(result.body.sold).toBe(true);
    expect(result.body).toHaveProperty('photos');
    expect(result.body).toHaveProperty('dateCreate');
    expect(result.body).not.toBeNull();
  });
  test('the name field should not be null', async () => {
    await templateUpdate(400, { ...product, name: null }, 'O campo nome é um atributo obrigatório', 10009);
  });
  test('the name field should not be null', async () => {
    await templateUpdate(400, { ...product, price: null }, 'O campo preço é um atributo obrigatório', 10009);
  });
  test('the name field should not be null', async () => {
    await templateUpdate(400, { ...product, sold: null }, 'O campo vendido é um atributo obrigatório', 10009);
  });
  test('the name field should not be null', async () => {
    await templateUpdate(400, { ...product, description: null }, 'O campo descrição é um atributo obrigatório', 10009);
  });
  test('the name field should be a string', async () => {
    await templateUpdate(400, { ...product, name: true }, 'O campo nome deve ser um(a) string', 10009);
  });
  test('the price field should be a number', async () => {
    await templateUpdate(400, { ...product, price: 'money' }, 'O campo preço deve ser um(a) number', 10009);
  });
  test('the description field should be a string', async () => {
    await templateUpdate(400, { ...product, description: true }, 'O campo descrição deve ser um(a) string', 10009);
  });
  test('the sold field should be a boolean', async () => {
    await templateUpdate(400, { ...product, sold: 'boolean' }, 'O campo vendido deve ser um(a) boolean', 10009);
  });
  test('the name field should not have values smaller or larger than the preset', async () => {
    await templateUpdate(400, { ...product, name: stringGenaretor(266) }, 'O campo nome deve ter de 0 a 255 caracteres', 10009);
  });
  test('the description field should not have values smaller than the preset', async () => {
    await templateUpdate(400, { ...product, description: stringGenaretor(15) }, 'O campo descrição deve ter de 16 a 255 caracteres', 10009);
  });
  test('the description field should not have values larger than the preset', async () => {
    await templateUpdate(400, { ...product, description: stringGenaretor(266) }, 'O campo descrição deve ter de 16 a 255 caracteres', 10009);
  });
  test('should begoten a the user logged', async () => {
    await templateUpdate(403, { ...product }, 'Este recurso não pertence ao usuário', 10008);
  });
});

