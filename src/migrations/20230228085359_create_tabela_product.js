/* eslint-disable linebreak-style */
exports.up = (knex) => knex.schema.createTable('products', (t) => {
  t.increments('id').primary();
  t.integer('user_id')
    .references('id')
    .inTable('users')
    .notNull();
  t.string('name', 255).notNull();
  t.decimal('price').notNull();
  t.boolean('sold').notNull().default(false);
  t.string('description', 255).notNull();
  t.binary('photos').default(null);
});

exports.down = (knex) => knex.schema.dropTable('products');
