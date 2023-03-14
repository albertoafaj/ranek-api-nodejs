exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('address').del();
  await knex('address').insert([
    {
      id: 10000,
      dateCreate: knex.fn.now(),
      dateLastUpdate: null,
      street: "Rua A",
      number: "1234",
      city: "Cidade",
      state: "BA",
      zipCode: 12345678,
      district: "Bairro",
    },
  ]);
};
