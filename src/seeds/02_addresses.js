exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('addresses').del();
  await knex('addresses').insert([
    {
      id: 10000,
      dateCreate: knex.fn.now(),
      dateLastUpdate: null,
      street: 'Rua A',
      number: '1234',
      city: 'Cidade',
      state: 'BA',
      zipCode: 12345678,
      district: 'Bairro',
    },
    {
      id: 10001,
      dateCreate: knex.fn.now(),
      dateLastUpdate: null,
      street: 'Rua B',
      number: '1234',
      city: 'Cidade',
      state: 'BA',
      zipCode: 12345678,
      district: 'Bairro',
    },
  ]);
};
