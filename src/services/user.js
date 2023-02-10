require('dotenv').config();
const ValidationError = require('../err/ValidationsError');
const bcrypt = require('bcryptjs');

module.exports = (app) => {
  const getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const findAll = () => app.db('users').select(['id', 'name', 'email', 'zipCode', 'street', 'number', 'city', 'state', 'district']);

  const findOne = (user) => app.db('users').where({ email: user.email }).select().first();

  const save = async (user) => {
    const userData = user;
    if (!userData.name) throw new ValidationError('Nome é um atributo obrigatório');
    if (!userData.email) throw new ValidationError('O e-mail é um atributo obrigatório');
    if (!userData.password) throw new ValidationError('A senha é um atributo obrigatório');
    const userDB = await findOne(user);
    if (userDB) throw new ValidationError('Já existe um usuário com este email');
    userData.password = getPasswordHash(userData.password);
    return app.db('users').insert(userData, ['id', 'name', 'email', 'zipCode', 'street', 'number', 'city', 'state', 'district']);
  };
  return { findAll, save, findOne };
};
