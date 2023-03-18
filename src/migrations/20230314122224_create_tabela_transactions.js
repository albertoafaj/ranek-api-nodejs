exports.up = (knex) => knex.schema.createTable('transactions', (t) => {
  t.increments('id').primary();
  t.integer('buyerId')
    .references('id')
    .inTable('users')
    .notNull();
  t.integer('productId')
    .references('id')
    .inTable('products')
    .notNull();
  t.integer('addressId')
    .references('id')
    .inTable('addresses')
    .notNull();
  t.timestamp('dateCreate', { useTz: true }).notNull().defaultTo(knex.fn.now());
  t.timestamp('dateLastUpdate', { useTz: true });
});

exports.down = (knex) => knex.schema.dropTable('transactions');
