class Transactions {
  constructor(
    id,
    buyerId,
    productId,
    addressId,
    dateCreate,
    dateLastUpdate,
  ) {
    this.id = id;
    this.buyerId = buyerId;
    this.productId = productId;
    this.addressId = addressId;
    this.dateCreate = dateCreate;
    this.dateLastUpdate = dateLastUpdate;
  }
}

module.exports = Transactions;