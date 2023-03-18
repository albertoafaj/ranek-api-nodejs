require('dotenv').config();
const bcrypt = require('bcryptjs');
const getTimestamp = require('../utils/getTimeStamp');
const ValidationError = require('../err/ValidationsError');
const Users = require('../models/Users');
const FieldValidator = require('../models/FieldValidator');
const dataValidator = require('../utils/dataValidator');

module.exports = (app) => {
  const getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const usersValidator = new Users(
    { ...new FieldValidator('id', 0, 2147483647, 'number', true, true, true) },
    { ...new FieldValidator('nome', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('email', 0, 255, 'string', true, true, true) },
    { ...new FieldValidator('senha', 6, 255, 'string', false, true, false) },
    { ...new FieldValidator('código postal', 8, 8, 'number', false, false, true) },
    { ...new FieldValidator('rua', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('número', 0, 8, 'string', false, false, true) },
    { ...new FieldValidator('cidade', 0, 50, 'string', false, false, true) },
    { ...new FieldValidator('estado', 2, 2, 'string', false, false, true) },
    { ...new FieldValidator('bairro', 0, 50, 'string', false, false, true) },
    { ...new FieldValidator('status', 0, 5, 'boolean', false, true, true) },
    { ...new FieldValidator('data de criação', 0, 255, 'string', false, true, true) },
    { ...new FieldValidator('data de atualização', 0, 255, 'string', false, false, true) },
  );

  const getUserFields = (field) => {
    let fieldValue;
    Object.entries(usersValidator).filter(([key, value]) => {
      if (key === field) { fieldValue = value; }
      return value;
    });
    return fieldValue;
  };

  const getUserProps = (propField, valueField) => {
    const arr = [];
    Object.entries(usersValidator).filter(([key, value]) => {
      const prop = key;
      Object.entries(value).forEach(([key2, value2]) => {
        if (key2 === propField && value2 === valueField) arr.push(prop);
        return value2;
      });
      return value;
    });
    return arr;
  };

  // TODO check the viability of email validation in the back end

  const validation = (
    user,
    insertAtLogin,
    checkIsNull,
    checkIsUnique,
    checkTypeOf,
    checkFieldLength,
  ) => {
    Object.entries(user).forEach(([key, value]) => {
      const userFields = getUserFields(key);
      if (checkIsNull && value === null) throw new ValidationError(`O campo ${userFields.translationToPt} é um atributo obrigatório`);
      const fieldLength = value.toString().length;
      if (
        (value && checkIsUnique)
        && (userFields.isUnique === true)
      ) throw new ValidationError(`O campo ${userFields.translationToPt} não pode ser alterado`);
      if (insertAtLogin && userFields.insertAtLogin === false) throw new ValidationError(`O campo ${userFields.translationToPt} não deve ser inserido nessa etapa`);
      if (
        (value && checkTypeOf)
        && (typeof value !== userFields.fieldType)
      ) throw new ValidationError(`O campo ${userFields.translationToPt} deve ser um(a) ${userFields.fieldType}`);
      if (
        (value && checkFieldLength)
        && (userFields.minFieldLength === userFields.maxFieldLength)
        && fieldLength !== userFields.maxFieldLength
      ) throw new ValidationError(`O campo ${userFields.translationToPt} deve ter ${userFields.maxFieldLength} caracteres`);
      if (
        (value && checkFieldLength)
        && (fieldLength < userFields.minFieldLength || fieldLength > userFields.maxFieldLength)
      ) throw new ValidationError(`O campo ${userFields.translationToPt} deve ter de ${userFields.minFieldLength} a ${userFields.maxFieldLength} caracteres`);
    });
  };

  const findAll = () => app.db('users').select(getUserProps('returnValue', true));

  const findOne = (user) => app.db('users').where({ email: user.email }).select().first();

  const save = async (user) => {
    const userData = user;
    if (!userData.email) throw new ValidationError('O campo e-mail é um atributo obrigatório');
    if (!userData.password) throw new ValidationError('O campo senha é um atributo obrigatório');
    const userDB = await findOne(user);
    if (userDB) throw new ValidationError('Já existe um usuário com este email');
    // TODO Refactor to use dataValidator component rather the validation method
    dataValidator(user, 'usuário', usersValidator, true, true, false, true, false);
    // validation(user, true, true, false, true, false);
    userData.password = getPasswordHash(userData.password);
    return app.db('users').insert(userData, getUserProps('returnValue', true));
  };

  const update = async (id, user) => {
    const userData = user;
    if (userData.password) userData.password = getPasswordHash(userData.password);
    validation(user, false, true, true, true, true);
    userData.dateLastUpdate = getTimestamp();
    return app.db('users').where({ id }).update(userData, getUserProps('returnValue', true));
  };
  return {
    findAll, save, findOne, update,
  };
};
