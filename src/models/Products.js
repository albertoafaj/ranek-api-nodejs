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

class Products {
  constructor(
    id,
    userId,
    name,
    price,
    sold,
    description,
    photos,
    dateCreate,
    dateLastUpdate,
  ) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.price = price;
    this.sold = sold;
    this.description = description;
    this.photos = photos;
    this.dateCreate = dateCreate;
    this.dateLastUpdate = dateLastUpdate;
  }
}

module.exports = Products;