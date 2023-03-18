exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('transactions').del();
  await knex('addresses').del();
  await knex('products').del();
  await knex('users').del();
  await knex('users').insert([
    {
      id: 10002,
      email: 'main_user@ranek.com',
      password: '$2a$10$93UtlY6qwnMZi5nIDguhUuyQ4SkEdtBGb4UMtFMlNHO6Kd9m2jZzq',
      status: true,
      dateCreate: knex.fn.now(),
    },
  ]);
};
