const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const express = require('express');
require('dotenv').config();

const ValidationsError = require('../err/ValidationsError');

module.exports = (app) => {
  const router = express.Router();
  router.post('/signin', async (req, res, next) => {
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
  });

  router.post('/signup', async (req, res, next) => {
    try {
      const user = await app.services.user.save(req.body);
      return res.status(201).json(user[0]);
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
