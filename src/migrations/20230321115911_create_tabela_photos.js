exports.up = (knex) => knex.schema.createTable('photos', (t) => {
  t.increments('id').primary();
  t.string('fieldname').notNull();
  t.string('originalname').notNull();
  t.string('encoding').notNull();
  t.string('mimetype').notNull();
  t.string('destination').notNull();
  t.string('filename').notNull();
  t.integer('size').notNull();
  t.string('url').notNull();
  t.string('title').notNull();
  t.timestamp('dateCreate', { useTz: true }).notNull().defaultTo(knex.fn.now());
  t.integer('productId')
    .references('id')
    .inTable('products');
});

exports.down = (knex) => knex.schema.dropTable('photos');
