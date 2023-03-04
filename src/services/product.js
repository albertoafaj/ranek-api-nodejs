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

  const findKeyWord = async (keywords) => {
    let result = [];
    const fieldSearch = ['name', 'description'];
    const keywordsList = keywords.split(' ');

    fieldSearch.forEach((field) => {
      keywordsList.forEach((keyword) => {
        result.push(app.db('products')
          .whereILike(field, `%${keyword}%`)
          .select());
      });
    });
    result = await Promise.all(result).then((data) => data);
    const removeDuplicate = [];
    result.map((duplicate) => duplicate.forEach((el) => {
      if (!removeDuplicate.includes(JSON.stringify(el))) {
        removeDuplicate.push(JSON.stringify(el));
      }
    }));
    result = removeDuplicate.map((el) => JSON.parse(el));
    return result;
  };

  const save = async (product) => app.db('products').insert(product, '*');
  return {
    findOne, save, findAll, findKeyWord,
  };
};
