exports.seed = async (knex) => {
  await knex('addresses').del();
  await knex('products').del();
  await knex('users').del();
  await knex('addresses').insert([
    {
      id: 10000,
      dateCreate: knex.fn.now(),
      dateLastUpdate: null,
      street: "Rua transactions",
      number: "1234",
      city: "Cidade",
      state: "BA",
      zipCode: 12345678,
      district: "Bairro",
    },
  ]);
  await knex('users').insert([
    {
      id: 10000,
      email: 'user_transactions@email.com',
      password: '$2a$10$S4VRH2lhQPSuwysEjJpYUu/eG4Jc1Bg5LF7J7OgsTN3H3H4vD3OYO',
      status: true,
      dateCreate: knex.fn.now(),
      dateLastUpdate: null,
    },
  ]);
  await knex('products').insert([
    {
      id: 10000,
      userId: 10000,
      name: 'Computador transactions',
      price: 6999.99,
      description: 'Note DELL I7',
      dateCreate: knex.fn.now(),
      dateLastUpdate: null,
    },
  ]);
  await knex('transactions').insert([
    {
      buyerId: 10000,
      productId: 10000,
      addressId: 10000,
      dateCreate: knex.fn.now(),
      dateLastUpdate: null,
    },

  ]);
};
