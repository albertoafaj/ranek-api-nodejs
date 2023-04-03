const request = require('supertest');
const app = require('../src/app');

const MAIN_ROUTE = '/v1/products';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJfcHJvZHVjdEBlbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMyJ9.thGSihWaYUNWqNvmTiHRKbTGr3Vf2OfppTuU-1HcKL8';

const stringGenaretor = (length) => {
  const arr = [];
  for (let i = 0; i < length; i += 1) {
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
    if (result.error) expect(result.body.error).toBe(errorMsg);
    return result;
  };
  test('should list all products', async () => {
    const result = await templateGet('', 200, '');
    expect(result.body.length).toBe(12);
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
    expect(result.body).toHaveLength(3);
    expect(result.body[0].id).toBe(10009);
  });

  test('should return in header field x-total-count', async () => {
    const result = await templateGet('?page=2&limit=2', 200, '');
    expect(result.header).toHaveProperty('x-total-count');
    expect(result.header['x-total-count']).toBe('12');
  });
  test('should return product not found message', async () => {
    await templateGet('99999', 400, 'Produto não encontrado');
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
    await templatePost(400, { ...product, name: null }, 'O campo nome do produto é um atributo obrigatório');
  });
  test('the price field should not be null', async () => {
    await templatePost(400, { ...product, price: null }, 'O campo preço do produto é um atributo obrigatório');
  });
  test('the description field should not be null', async () => {
    await templatePost(400, { ...product, description: null }, 'O campo descrição do produto é um atributo obrigatório');
  });
  test('the name field should be a string', async () => {
    await templatePost(400, { ...product, name: true }, 'O campo nome do produto deve ser um(a) string');
  });
  test('the price field should be a number', async () => {
    await templatePost(400, { ...product, price: 'money' }, 'O campo preço do produto deve ser um(a) number');
  });
  test('the description field should be a string', async () => {
    await templatePost(400, { ...product, description: true }, 'O campo descrição do produto deve ser um(a) string');
  });
  test('the photos field should be a object', async () => {
    await templatePost(400, { ...product, photos: 'photo.jpeg' }, 'O campo fotos do produto deve ser um(a) object');
  });
});

describe('Whe try salve products with photo', () => {
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
    photos: [
      {
        id: 10001,
        fieldname: 'files',
        originalname: 'img-project-portfolio-360x280.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'D:\\Projects\\Pratical-studies\\ranek-api\\uploads',
        filename: 'not-remove-img-project-portfolio-360x280.jpg',
        url: 'D:\\Projects\\Pratical-studies\\ranek-api\\uploads\\not-remove-img-project-portfolio-360x280.jpg',
        size: 6731,
        title: 'Screen portfolio 2',
        dateCreate: '2023-03-30T11:16:17.307Z',
        productId: 10011,
      },
    ],
  };
  test('should return status 200', async () => {
    const result = await templatePost(200, product, '');
    expect(result.body.photos[0]).toHaveProperty('id');
    expect(result.body.photos[0]).toHaveProperty('fieldname');
    expect(result.body.photos[0]).toHaveProperty('originalname');
    expect(result.body.photos[0]).toHaveProperty('mimetype');
    expect(result.body.photos[0]).toHaveProperty('destination');
    expect(result.body.photos[0]).toHaveProperty('filename');
    expect(result.body.photos[0]).toHaveProperty('url');
    expect(result.body.photos[0]).toHaveProperty('size');
    expect(result.body.photos[0]).toHaveProperty('title');
    expect(result.body.photos[0]).toHaveProperty('dateCreate');
    expect(result.body.photos[0]).toHaveProperty('productId');
  });
  test('the name fieldname should not be null', async () => {
    await templatePost(400, { ...product, photos: [{ ...product.photos[0], fieldname: null }] }, 'O campo fieldname da foto é um atributo obrigatório');
  });
});

describe('when try update products', () => {
  const templateUpdate = async (status, body, errorMsg, product) => {
    const result = await request(app)
      .put(`${MAIN_ROUTE}/${product}`)
      .set('authorization', `bearer ${TOKEN}`)
      .send(body);
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
    await templateUpdate(400, { ...product, name: null }, 'O campo nome do produto é um atributo obrigatório', 10009);
  });
  test('the name field should not be null', async () => {
    await templateUpdate(400, { ...product, price: null }, 'O campo preço do produto é um atributo obrigatório', 10009);
  });
  test('the name field should not be null', async () => {
    await templateUpdate(400, { ...product, sold: null }, 'O campo vendido do produto é um atributo obrigatório', 10009);
  });
  test('the name field should not be null', async () => {
    await templateUpdate(400, { ...product, description: null }, 'O campo descrição do produto é um atributo obrigatório', 10009);
  });
  test('the name field should be a string', async () => {
    await templateUpdate(400, { ...product, name: true }, 'O campo nome do produto deve ser um(a) string', 10009);
  });
  test('the price field should be a number', async () => {
    await templateUpdate(400, { ...product, price: 'money' }, 'O campo preço do produto deve ser um(a) number', 10009);
  });
  test('the description field should be a string', async () => {
    await templateUpdate(400, { ...product, description: true }, 'O campo descrição do produto deve ser um(a) string', 10009);
  });
  test('the sold field should be a boolean', async () => {
    await templateUpdate(400, { ...product, sold: 'boolean' }, 'O campo vendido do produto deve ser um(a) boolean', 10009);
  });
  test('the name field should not have values smaller or larger than the preset', async () => {
    await templateUpdate(400, { ...product, name: stringGenaretor(266) }, 'O campo nome do produto deve ter de 0 a 255 caracteres', 10009);
  });
  test('the description field should not have values smaller than the preset', async () => {
    await templateUpdate(400, { ...product, description: stringGenaretor(15) }, 'O campo descrição do produto deve ter de 16 a 255 caracteres', 10009);
  });
  test('the description field should not have values larger than the preset', async () => {
    await templateUpdate(400, { ...product, description: stringGenaretor(266) }, 'O campo descrição do produto deve ter de 16 a 255 caracteres', 10009);
  });
  test('should begoten a the user logged', async () => {
    await templateUpdate(403, { ...product }, 'Este recurso não pertence ao usuário', 10008);
  });
});

describe('when try delete a product', () => {
  test('should remove a product', async () => {
    const result = await request(app)
      .delete(`${MAIN_ROUTE}/10009`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(204);
  });
  test('should remove a product', async () => {
    const result = await request(app)
      .delete(`${MAIN_ROUTE}/99999`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Produto não encontrado');
  });
  test('should not remove a product from another user', async () => {
    const result = await request(app)
      .delete(`${MAIN_ROUTE}/10007`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(403);
    expect(result.body.error).toBe('Este recurso não pertence ao usuário');
  });
  test('should not remove a product that belongs to a transaction', async () => {
    const result = await request(app)
      .delete(`${MAIN_ROUTE}/10008`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Essa produto possui transações associadas');
  });
  test('should remove all photos related to it', async () => {
    const result = await request(app)
      .delete(`${MAIN_ROUTE}/10011`)
      .set('authorization', `bearer ${TOKEN}`);
    expect(result.status).toBe(204);
  });
});
