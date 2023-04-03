class Users {
  constructor(
    id,
    name,
    email,
    password,
    zipCode,
    street,
    number,
    city,
    state,
    district,
    status,
    dateCreate,
    dateLastUpdate,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.zipCode = zipCode;
    this.street = street;
    this.number = number;
    this.city = city;
    this.state = state;
    this.district = district;
    this.status = status;
    this.dateCreate = dateCreate;
    this.dateLastUpdate = dateLastUpdate;
  }
}

module.exports = Users;
