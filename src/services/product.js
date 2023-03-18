const Products = require('../models/Products');
const FieldValidator = require('../models/FieldValidator');
const dataValidator = require('../utils/dataValidator');
const getTimestamp = require('../utils/getTimeStamp');
const WrongResourceError = require('../err/WrongResourceError');
const ValidationsError = require('../err/ValidationsError');

module.exports = (app) => {
  const productsValidator = new Products(
    { ...new FieldValidator('id do produto', 0, 2147483647, 'number', true, true, true) },
    { ...new FieldValidator('id do usuário do produto', 0, 2147483647, 'number', false, false, true) },
    { ...new FieldValidator('nome do produto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('preço do produto', 0, 16, 'number', false, false, true) },
    { ...new FieldValidator('vendido do produto', 0, 5, 'boolean', false, false, true) },
    { ...new FieldValidator('descrição do produto', 16, 255, 'string', false, false, true) },
    { ...new FieldValidator('fotos do produto', 0, 2147483647, 'Object', false, false, true) },
    { ...new FieldValidator('data de criação do produto', 0, 255, 'string', false, true, true) },
    { ...new FieldValidator('data de atualização do produto', 0, 255, 'string', false, false, true) },
  );

  const findOne = async (filter) => {
    dataValidator(filter, 'produto', productsValidator, false, true, false, true, true);
    const result = await app.db('products').where(filter).first();
    return result;
  };
  const findAll = (filter) => app.db('products').where(filter).select();

  const findKeyWord = async (keywords) => {
    let result = [];
    const fieldSearch = ['name', 'description'];
    const keywordsList = keywords.split(' ');
    const removeDuplicate = [];

    fieldSearch.forEach((field) => {
      keywordsList.forEach((keyword) => {
        result.push(app.db('products')
          .whereILike(field, `%${keyword}%`)
          .select());
      });
    });
    result = await Promise.all(result).then((data) => data);
    result.map((duplicate) => duplicate.forEach((el) => {
      if (!removeDuplicate.includes(JSON.stringify(el))) {
        removeDuplicate.push(JSON.stringify(el));
      }
    }));
    result = removeDuplicate.map((el) => JSON.parse(el));
    return result;
  };

  const save = async (product) => {
    dataValidator(product, 'produto', productsValidator, false, true, false, true, true);
    return app.db('products').insert(product, '*');
  };

  const update = async (product) => {
    const productData = product;
    dataValidator(product, 'produto', productsValidator, false, true, false, true, true);
    productData.dateLastUpdate = getTimestamp();
    const productDB = await findOne({ id: productData.id });
    if (productData.userId !== productDB.userId) throw new WrongResourceError();
    return app.db('products').where({ id: productData.id }).update(productData, '*');
  };
  const remove = async (id, userId) => {
    const transaction = await app.services.transaction.findOne({ productId: id });
    const productDB = await findOne({ id });
    if (transaction) throw new ValidationsError('Essa produto possui transações associadas');
    if (userId !== productDB.userId) throw new WrongResourceError();
    return app.db('products').where({ id }).delete();
  };
  return {
    findOne, save, findAll, findKeyWord, update, remove,
  };
};
