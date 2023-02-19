const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
require('dotenv').config();

const ValidationsError = require('../err/ValidationsError');

module.exports = (app) => {
  const signin = async (req, res, next) => {
    try {
      if (!req.body.email) throw new ValidationsError('Usuário ou senha inválido');
      const user = await app.services.user.findOne({ email: req.body.email });
      let payload;
      if (!user) throw new ValidationsError('Usuário ou senha inválido');
      if (bcrypt.compareSync(req.body.password, user.password)) {
        payload = {
          id: user.id,
          email: user.email,
        };
      } else {
        throw new ValidationsError('Usuário ou senha inválido');
      }
      const token = jwt.encode(payload, process.env.JWTSEC);
      return res.status(200).json({ token });
    } catch (error) {
      return next(error);
    }
  };
  return { signin };
};
