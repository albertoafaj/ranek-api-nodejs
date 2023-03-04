exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('products').del();
  await knex('users').del();
  await knex('users').insert([
    {
      id: 10000,
      email: 'user_product@email.com',
      password: '$2a$10$S4VRH2lhQPSuwysEjJpYUu/eG4Jc1Bg5LF7J7OgsTN3H3H4vD3OYO',
      status: true,
      dateCreate: knex.fn.now(),
    },
  ]);
  await knex('products').insert([
    {
      id: 10000,
      userId: 10000,
      name: 'Computador',
      price: 6999.99,
      description: 'Note DELL I7',
      dateCreate: knex.fn.now(),
    },
    {
      id: 10001,
      userId: 10000,
      name: 'Notebook',
      price: 6999.99,
      description: 'DELL I7',
      dateCreate: knex.fn.now(),
    },
    {
      id: 10002,
      userId: 10000,
      name: 'Notebook2',
      price: 7999.99,
      description: 'Notebook DELL I7 query d',
      dateCreate: knex.fn.now(),
    },
    {
      id: 10003,
      userId: 10000,
      name: 'Smartphone',
      price: 7999.99,
      description: 'Smartphone query d',
      dateCreate: knex.fn.now(),
    }
  ]);
};
