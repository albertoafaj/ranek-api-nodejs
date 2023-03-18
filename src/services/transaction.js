const Transactions = require('../models/Transactions');
const FieldValidator = require('../models/FieldValidator');
const dataValidator = require('../utils/dataValidator');
const getTimestamp = require('../utils/getTimeStamp');
const ValidationsError = require('../err/ValidationsError');

module.exports = (app) => {
  const transactionValidator = new Transactions(
    { ...new FieldValidator('id da transação', 0, 2147483647, 'number', true, true, true) },
    { ...new FieldValidator('id do comprador da transação', 0, 2147483647, 'number', false, false, true) },
    { ...new FieldValidator('id do produto da transação', 0, 2147483647, 'number', false, false, true) },
    { ...new FieldValidator('endereço da transação', 0, 2147483647, 'number', false, false, true) },
    { ...new FieldValidator('data de criação da transação', 0, 255, 'string', false, true, true) },
    { ...new FieldValidator('data de atualização da transação', 0, 255, 'string', false, false, true) },
  );

  const findOne = async (filter) => {
    const result = await app.db('transactions').where(filter).first();
    return result;
  };

  const save = async (transaction, productUserId) => {
    dataValidator(transaction, 'transação', transactionValidator, false, true, false, true, true);
    if (transaction.buyerId === productUserId) throw new ValidationsError('O usuário não pode comprar seus próprios produtos');
    return app.db('transactions').insert(transaction, '*');
  };

  const update = async (transaction, productUserId) => {
    const transactionData = transaction;
    dataValidator(transactionData, 'transação', transactionValidator, false, true, false, true, true);
    if (transactionData.buyerId === productUserId) throw new ValidationsError('O usuário não pode comprar seus próprios produtos');
    transactionData.dateLastUpdate = getTimestamp();
    return app.db('transactions').where({ id: transactionData.id }).update(transactionData, '*');
  };
  const remove = async (id) => app.db('transactions').where({ id }).delete();
  return {
    findOne, save, update, remove,
  };
};
