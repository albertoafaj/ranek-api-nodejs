exports.seed = async (knex) => {
  await knex('transactions').del();
  await knex('transactions').insert([
    {
      id: 10000,
      buyerId: 10000,
      productId: 10000,
      addressId: 10000,
      dateCreate: knex.fn.now(),
      dateLastUpdate: null,
    },

  ]);
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
};
