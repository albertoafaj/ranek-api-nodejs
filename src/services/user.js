const ValidationError = require('../err/ValidationsError');

module.exports = (app) => {
  const findAll = () => app.db('users').select();

  const save = async (user) => {
    if (!user.name) throw new ValidationError('Nome é um atributo obrigatório');
    if (!user.email) throw new ValidationError('O e-mail é um atributo obrigatório');
    if (!user.password) throw new ValidationError('A senha é um atributo obrigatório');
    const email = await app.db('users').where({ email: user.email }).select();
    if (email.length > 0) throw new ValidationError('Já existe um usuário com este email');
    return app.db('users').insert(user, '*');
  };

  return { findAll, save };
};
