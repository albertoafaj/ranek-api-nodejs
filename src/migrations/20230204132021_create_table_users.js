/* eslint-disable linebreak-style */

exports.up = (knex) => knex.schema.createTable('users', (t) => {
  t.increments('id').primary();
  t.string('name').notNull();
  t.string('email').notNull().unique();
  t.string('password').notNull();
  t.string('street');
  t.string('number');
  t.string('city');
  t.string('state');
  t.string('zipCode');
  t.string('district');
});

exports.down = (knex) => {
  knex.schema.dropTable('users');
};
