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