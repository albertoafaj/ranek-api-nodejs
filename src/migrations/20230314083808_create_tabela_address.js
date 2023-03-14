exports.up = (knex) => knex.schema.createTable('address', (t) => {
  t.increments('id').primary();
  t.timestamp('dateCreate', { useTz: true }).notNull().defaultTo(knex.fn.now());
  t.timestamp('dateLastUpdate', { useTz: true });
  t.string('street', 255);
  t.string('number', 8);
  t.string('city', 50);
  t.string('state', 2);
  t.integer('zipCode', 8);
  t.string('district', 50);
});

exports.down = (knex) => knex.schema.dropTable('address');
