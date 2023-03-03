module.exports = (app) => {
  // TODO create component fields params

  /* function Fields(
    translationToPt,
    minFieldLength,
    maxFieldLength,
    fieldType,
    isUnique,
    insertAtLogin,
    returnValue,
  ) {
    this.translationToPt = translationToPt;
    this.minFieldLength = minFieldLength;
    this.maxFieldLength = maxFieldLength;
    this.fieldType = fieldType;
    this.isUnique = isUnique;
    this.insertAtLogin = insertAtLogin;
    this.returnValue = returnValue;
  }
  class Products {
    constructor(id, userId, name, price, sold, description, photos, dateCreate, dateLastUpdate) {
      this.id = { ...new Fields(...id) };
      this.userId = { ...new Fields(...userId) };
      this.name = { ...new Fields(...name) };
      this.price = { ...new Fields(...price) };
      this.sold = { ...new Fields(...sold) };
      this.description = { ...new Fields(...description) };
      this.photos = { ...new Fields(...photos) };
      this.dateCreate = { ...new Fields(...dateCreate) };
      this.dateLastUpdate = { ...new Fields(...dateLastUpdate) };
    }
  } */

  /*   const products = new Products(
      ['id', 0, 2147483647, 'number', true, true, true],
      ['id do usuário', 0, 2147483647, 'number', false, false, true],
      ['nome', 0, 255, 'string', false, false, true],
      ['preço', 0, 16, 'number', false, false, true],
      ['vendido', 0, 5, 'boolean', false, false, true],
      ['fotos', 0, 2147483647, 'sring', false, false, true],
      ['data de criação', 0, 255, 'string', false, true, true],
      ['data de atualização', 0, 255, 'string', false, false, true],
    ); */

  const findOne = (filter) => app.db('products').where(filter).first();
  const findAll = (filter) => app.db('products').where(filter).select();

  const findQ = (field, keyword) => app.db('products')
    .whereLike(field, `%${keyword}%`)
    .select();

  const save = async (product) => app.db('products').insert(product, '*');
  return {
    findOne, save, findAll, findQ,
  };
};
