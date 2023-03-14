const Addresses = require('../models/Addresses');
const FieldValidator = require('../models/FieldValidator');
const dataValidator = require('../utils/dataValidator');
const getTimestamp = require('../utils/getTimeStamp');

module.exports = (app) => {

  const addressValidator = new Addresses(
    { ...new FieldValidator('id', 0, 2147483647, 'number', true, true, true) },
    { ...new FieldValidator('código postal', 8, 8, 'number', false, false, true) },
    { ...new FieldValidator('rua', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('número', 0, 8, 'string', false, false, true) },
    { ...new FieldValidator('cidade', 0, 50, 'string', false, false, true) },
    { ...new FieldValidator('estado', 2, 2, 'string', false, false, true) },
    { ...new FieldValidator('bairro', 0, 50, 'string', false, false, true) },
    { ...new FieldValidator('data de criação', 0, 255, 'string', false, true, true) },
    { ...new FieldValidator('data de atualização', 0, 255, 'string', false, false, true) },
  );

  const findOne = async (filter) => {
    const result = await app.db('addresses').where(filter).first();
    return result;
  };
  // const findAll = (filter) => app.db('products').where(filter).select();

  const save = async (address) => {
    dataValidator(address, addressValidator, false, true, false, true, true);
    return app.db('addresses').insert(address, '*');
  }

  const update = async (address) => {
    const addressData = address;
    console.log('addressData', addressData);
    dataValidator(address, addressValidator, false, true, false, true, true);
    console.log('addressData', addressData);
    addressData.dateLastUpdate = getTimestamp();
    return app.db('addresses').where({ id: addressData.id }).update(addressData, '*');
  }
  const remove = async (id) => {
    return app.db('addresses').where({ id }).delete();
  }
  return {
    findOne, save, update, remove,
  };
};
