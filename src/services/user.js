module.exports = (app) => {
  const findAll = () => app.db('users').select();

  const save = async (user) => {
    if (!user.name) return { error: 'Nome é um atributo obrigatório' };
    if (!user.email) return { error: 'O e-mail é um atributo obrigatório' };
    if (!user.password) return { error: 'A senha é um atributo obrigatório' };
    const email = await app.db('users').where({ email: user.email }).select();
    if (email.length > 0) return { error: 'Já existe um usuário com este email' };
    return app.db('users').insert(user, '*');
  };

  return { findAll, save };
};
