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
      price: 3999.99,
      description: 'TechnoRanek query d',
      dateCreate: knex.fn.now(),
    },
    {
      id: 10004,
      userId: 10000,
      name: 'PC Gamer',
      price: 3999.99,
      description: 'PC Gamer Techno',
      dateCreate: knex.fn.now(),
    },
    {
      id: 10005,
      userId: 10000,
      name: 'Monitor 17',
      price: 3999.99,
      description: 'Monitor Techno query d',
      dateCreate: knex.fn.now(),
    },
    {
      id: 10006,
      userId: 10000,
      name: 'Monitor 21',
      price: 3999.99,
      description: 'Monitor 21 polegadas',
      dateCreate: knex.fn.now(),
    },
    {
      id: 10007,
      userId: 10000,
      name: 'Mouse',
      price: 3999.99,
      description: 'Mouse ',
      dateCreate: knex.fn.now(),
    },
    {
      id: 10008,
      userId: 10000,
      name: 'Teclado',
      price: 3999.99,
      description: 'Teclado Techno query d',
      dateCreate: knex.fn.now(),
    },
    {
      id: 10009,
      userId: 10000,
      name: 'Phone de Ouvido',
      price: 3999.99,
      description: 'Phone de Ouvido Techno query d',
      dateCreate: knex.fn.now(),
    },
  ]);
};
