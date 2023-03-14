const { Router } = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auth);
  const protectRouter = Router();
  protectRouter.use('/users', app.routes.users);
  protectRouter.use('/products', app.routes.products);
  protectRouter.use('/addresses', app.routes.addresses);
  app.use('/v1', app.config.passport.authenticate(), protectRouter);
};
