exports.up = (knex) => knex.schema.createTable('products', (t) => {
  t.increments('id').primary();
  t.integer('userId')
    .references('id')
    .inTable('users')
    .notNull();
  t.string('name', 255).notNull();
  t.decimal('price').notNull();
  t.boolean('sold').notNull().default(false);
  t.string('description', 255).notNull();
  t.binary('photos').default(null);
  t.timestamp('dateCreate', { useTz: true }).notNull().defaultTo(knex.fn.now());
  t.timestamp('dateLastUpdate', { useTz: true });
});

exports.down = (knex) => knex.schema.dropTable('products');
