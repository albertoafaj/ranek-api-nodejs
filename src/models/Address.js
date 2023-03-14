class Address {
  constructor(
    id,
    zipCode,
    street,
    number,
    city,
    state,
    district,
    dateCreate,
    dateLastUpdate,
  ) {
    this.id = id;
    this.zipCode = zipCode;
    this.street = street;
    this.number = number;
    this.city = city;
    this.state = state;
    this.district = district;
    this.dateCreate = dateCreate;
    this.dateLastUpdate = dateLastUpdate;
  }

  constructor(id) {
    this.id = id;
  }

}

module.exports = Address;