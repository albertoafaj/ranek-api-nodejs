/* eslint-disable max-len */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const ValidationError = require('../err/ValidationsError');

module.exports = (app) => {
  const getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const userResponseFields = ['id', 'name', 'email', 'zipCode', 'street', 'number', 'city', 'state', 'district', 'status', 'dateCreate', 'dateLastUpdate'];

  const users = {
    id: {
      translation_pt: 'id',
      minFieldLength: 0,
      maxFieldLength: 2147483647,
      fieldType: 'number',
      isUnique: true,
      insertAtLogin: true,
      returnValue: true,
    },
    name: {
      translation_pt: 'nome',
      minFieldLength: 0,
      maxFieldLength: 255,
      fieldType: 'string',
      isUnique: false,
      insertAtLogin: false,
      returnValue: true,
    },
    email: {
      translation_pt: 'email',
      minFieldLength: 0,
      maxFieldLength: 255,
      fieldType: 'string',
      isUnique: true,
      insertAtLogin: true,
      returnValue: true,
    },
    password: {
      translation_pt: 'senha',
      minFieldLength: 6,
      maxFieldLength: 255,
      fieldType: 'string',
      isUnique: false,
      insertAtLogin: true,
      returnValue: false,
    },
    zipCode: {
      translation_pt: 'código postal',
      minFieldLength: 8,
      maxFieldLength: 8,
      fieldType: 'number',
      isUnique: false,
      insertAtLogin: false,
      returnValue: true,
    },
    street: {
      translation_pt: 'rua',
      minFieldLength: 0,
      maxFieldLength: 255,
      fieldType: 'string',
      isUnique: false,
      insertAtLogin: false,
      returnValue: true,
    },
    number: {
      translation_pt: 'número',
      minFieldLength: 0,
      maxFieldLength: 8,
      fieldType: 'string',
      isUnique: false,
      insertAtLogin: false,
      returnValue: true,
    },
    city: {
      translation_pt: 'cidade',
      minFieldLength: 0,
      maxFieldLength: 50,
      fieldType: 'string',
      isUnique: false,
      insertAtLogin: false,
      returnValue: true,
    },
    state: {
      translation_pt: 'estado',
      minFieldLength: 2,
      maxFieldLength: 2,
      fieldType: 'string',
      isUnique: false,
      insertAtLogin: false,
      returnValue: true,
    },
    district: {
      translation_pt: 'bairro',
      minFieldLength: 0,
      maxFieldLength: 50,
      fieldType: 'string',
      isUnique: false,
      insertAtLogin: false,
      returnValue: true,
    },
    status: {
      translation_pt: 'status',
      minFieldLength: 0,
      maxFieldLength: 5,
      fieldType: 'boolean',
      isUnique: false,
      insertAtLogin: true,
      returnValue: true,
    },
    dateCreate: {
      translation_pt: 'data de criação',
      minFieldLength: 0,
      maxFieldLength: 255,
      fieldType: 'string',
      isUnique: false,
      insertAtLogin: true,
      returnValue: true,
    },
    dateLastUpdate: {
      translation_pt: 'data de atualização',
      minFieldLength: 0,
      maxFieldLength: 255,
      fieldType: 'string',
      isUnique: false,
      insertAtLogin: false,
      returnValue: true,
    },
  };

  const getUserFields = (field) => {
    let translated;
    // eslint-disable-next-line array-callback-return
    Object.entries(users).filter(([key, value]) => {
      if (key === field) { translated = value; }
    });
    return translated;
  };

  // TODO check the viability of email validation in the back end

  /*   const validateEmail = (email) => {
    const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!reg.test(email)) {
        throw ValidationError('Email invalido');
      }
    }; */

  const validation = (user) => {
    Object.entries(user).forEach(([key, value]) => {
      const userFields = getUserFields(key);
      if (value === null) throw new ValidationError(`O campo ${userFields.translation_pt} é um atributo obrigatório`);
      const fieldLength = value.toString().length;
      if (
        (value)
        && (userFields.isUnique === true)
      ) throw new ValidationError(`O campo ${userFields.translation_pt} não pode ser alterado`);
      if (
        (value)
        // eslint-disable-next-line valid-typeof
        && (typeof value !== userFields.fieldType)
      ) throw new ValidationError(`O campo ${userFields.translation_pt} deve ser um(a) ${userFields.fieldType}`);
      if (
        (value)
        && (userFields.minFieldLength === userFields.maxFieldLength)
        && fieldLength !== userFields.maxFieldLength
      ) throw new ValidationError(`O campo ${userFields.translation_pt} deve ter ${userFields.maxFieldLength} caracteres`);
      if (
        (value)
        && (fieldLength < userFields.minFieldLength || fieldLength > userFields.maxFieldLength)
      ) throw new ValidationError(`O campo ${userFields.translation_pt} deve ter de ${userFields.minFieldLength} a ${userFields.maxFieldLength} caracteres`);
    });
  };

  // TODO Transfer getTimestamp for Helpers;
  const getTimestamp = () => {
    const today = new Date();
    const isLessThanTen = (num) => ((num < 10) ? `0${num}` : num);
    const yy = today.getFullYear();
    const mm = isLessThanTen(today.getMonth() + 1);
    const dd = isLessThanTen(today.getDate());
    const hh = isLessThanTen(today.getHours());
    const ms = isLessThanTen(today.getMinutes());
    const ss = isLessThanTen(today.getSeconds());
    const tz = today.getTimezoneOffset() / 60;
    return `${yy}-${mm}-${dd} ${hh}:${ms}:${ss} ${(tz < 0) ? `-${tz}` : `+${tz}`}:00`;
  };

  const findAll = () => app.db('users').select(userResponseFields);

  const findOne = (user) => app.db('users').where({ email: user.email }).select().first();

  const save = async (user) => {
    const userData = user;
    // if (!userData.name) throw new ValidationError('Nome é um atributo obrigatório');
    if (!userData.email) throw new ValidationError('O campo e-mail é um atributo obrigatório');
    // validateEmail(userData.email);
    if (!userData.password) throw new ValidationError('A campo senha é um atributo obrigatório');
    const userDB = await findOne(user);
    if (userDB) throw new ValidationError('Já existe um usuário com este email');
    Object.entries(userData).forEach(([key]) => {
      const userField = getUserFields(key);
      if (userField.insertAtLogin === false) throw new ValidationError(`O campo ${userField.translation_pt} não deve ser inserido nessa etapa`);
    });
    userData.password = getPasswordHash(userData.password);
    return app.db('users').insert(userData, userResponseFields);
  };

  const update = async (id, user) => {
    const userData = user;
    if (userData.password) userData.password = getPasswordHash(userData.password);
    validation(user);
    userData.dateLastUpdate = getTimestamp();
    return app.db('users').where({ id }).update(userData, userResponseFields);
  };
  return {
    findAll, save, findOne, update,
  };
};
