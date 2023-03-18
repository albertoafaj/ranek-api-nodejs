exports.seed = async (knex) => {
  await knex('products').insert([
    {
      id: 10010,
      userId: 10001,
      name: 'Notebook transaction',
      price: 6999.99,
      description: 'DELL I7',
      dateCreate: knex.fn.now(),
    },

  ]);
  await knex('transactions').insert([
    {
      id: 10000,
      buyerId: 10000,
      productId: 10010,
      addressId: 10000,
      dateCreate: knex.fn.now(),
      dateLastUpdate: null,
    },

  ]);
};
