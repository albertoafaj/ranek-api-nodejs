exports.up = (knex) => knex.schema.createTable('addresses', (t) => {
  t.increments('id').primary();
  t.timestamp('dateCreate', { useTz: true }).notNull().defaultTo(knex.fn.now());
  t.timestamp('dateLastUpdate', { useTz: true });
  t.string('street', 255).notNull();
  t.string('number', 8).notNull();
  t.string('city', 50).notNull();
  t.string('state', 2).notNull();
  t.integer('zipCode', 8).notNull();
  t.string('district', 50).notNull();
});

exports.down = (knex) => knex.schema.dropTable('addresses');
