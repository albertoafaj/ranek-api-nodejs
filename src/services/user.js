require('dotenv').config();
const bcrypt = require('bcryptjs');
const ValidationError = require('../err/ValidationsError');

module.exports = (app) => {
  const getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };
  // TODO create timestamp method in Helpers ;

  const userResponseFields = ['id', 'name', 'email', 'zipCode', 'street', 'number', 'city', 'state', 'district', 'status', 'dateCreate', 'dateLastUpdate'];
  const fieldNameTranslation = {
    id: 'id',
    name: 'nome',
    email: 'email',
    password: 'senha',
    zipCode: 'código postal',
    street: 'rua',
    number: 'número',
    city: 'cidade',
    state: 'estado',
    district: 'bairro',
    status: 'status',
    dateCreate: 'data de criação',
    dateLastUpdate: 'data de atualização',
  };

  // TODO create user validation rules
  /* const users = {
    id: {
      translation_pt: 'id',
      fieldLength: 2147483647,
      fieldType: 'number',
      returnValue: true,
    },
    name: {
      translation_pt: 'nome',
      fieldLength: 255,
      fieldType: 'string',
      returnValue: true,
    },
    email: {
      translation_pt: 'email',
      fieldLength: 255,
      fieldType: 'string',
      returnValue: true,
    },
    password: {
      translation_pt: 'senha',
      fieldLength: 255,
      fieldType: 'string',
      returnValue: false,
    },
    zipCode: {
      translation_pt: 'código postal',
      fieldLength: 8,
      fieldType: 'number',
      returnValue: true,
    },
    street: {
      translation_pt: 'rua',
      fieldLength: 255,
      fieldType: 'string',
      returnValue: true,
    },
    number: {
      translation_pt: 'número',
      fieldLength: 8,
      fieldType: 'string',
      returnValue: true,
    },
    city: {
      translation_pt: 'cidade',
      fieldLength: 50,
      fieldType: 'string',
      returnValue: true,
    },
    state: {
      translation_pt: 'estado',
      fieldLength: 2,
      fieldType: 'boolean',
      returnValue: true,
    },
    district: {
      translation_pt: 'bairro',
      fieldLength: 50,
      fieldType: 'string',
      returnValue: true,
    },
    status: {
      translation_pt: 'status',
      fieldLength: 5,
      fieldType: 'bollean',
      returnValue: true,
    },
    dateCreate: {
      translation_pt: 'data de criação',
      fieldLength: 255,
      fieldType: 'string',
      returnValue: true,
    },
    dateLastUpdate: {
      translation_pt: 'data de atualização',
      fieldLength: 255,
      fieldType: 'string',
      returnValue: true,
    },
  }; */

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

  const translateField = (field) => {
    let translated;
    Object.entries(fieldNameTranslation).filter(([key, value]) => {
      if (key === field) { translated = value; }
    });
    return translated;
  };

  const findAll = () => app.db('users').select(userResponseFields);

  const findOne = (user) => app.db('users').where({ email: user.email }).select().first();

  const save = async (user) => {
    const userData = user;

    if (!userData.name) throw new ValidationError('Nome é um atributo obrigatório');
    if (!userData.email) throw new ValidationError('O e-mail é um atributo obrigatório');
    if (!userData.password) throw new ValidationError('A senha é um atributo obrigatório');
    const userDB = await findOne(user);
    if (userDB) throw new ValidationError('Já existe um usuário com este email');
    userData.password = getPasswordHash(userData.password);
    return app.db('users').insert(userData, userResponseFields);
  };
  // TODO recfator validation of length fields
  const update = async (id, user) => {
    const userData = user;
    Object.entries(user).forEach(([key, value]) => {
      if (value === null) throw new ValidationError(`O campo ${translateField(key)} é um atributo obrigatório`);
    });
    if (userData.password) userData.password = getPasswordHash(userData.password);
    if (userData.id) throw new ValidationError('O campo id não pode ser alterado');
    if (userData.email) throw new ValidationError('O campo email não pode ser alterado');
    if ((userData.zipCode) && (userData.zipCode.toString().length !== 8)) throw new ValidationError('O código postal deve ser preenchido com uma sequência de oito números');
    if ((userData.zipCode) && (typeof userData.zipCode !== 'number')) throw new ValidationError('O código postal deve ser preenchido com uma sequência de oito números');
    if ((userData.street) && userData.street.toString().length > 50) throw new ValidationError('O campo rua não deve ter mais de 50 caracteres');
    if ((userData.status) && typeof userData.status !== 'boolean') throw new ValidationError('O campo status deve ser um boleano, passe o atributo(true or false)');
    if ((userData.number) && userData.number.toString().length > 8) throw new ValidationError('O campo número não deve ter mais de 8 caracteres');
    if ((userData.number) && typeof userData.number !== 'string') throw new ValidationError('O campo número deve ser um(a) string');
    userData.dateLastUpdate = getTimestamp();

    return app.db('users').where({ id }).update(userData, userResponseFields);
  };
  return {
    findAll, save, findOne, update,
  };
};
