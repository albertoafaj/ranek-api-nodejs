const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auth);
  app.use('/uploads', express.static('tmp/uploads'));
  const protectRouter = express.Router();
  protectRouter.use('/users', app.routes.users);
  protectRouter.use('/products', app.routes.products);
  protectRouter.use('/addresses', app.routes.addresses);
  protectRouter.use('/transactions', app.routes.transactions);
  protectRouter.use('/photos', app.routes.photos);
  app.use('/v1', app.config.passport.authenticate(), protectRouter);
};
