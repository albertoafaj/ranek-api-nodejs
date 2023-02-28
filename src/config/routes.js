const { Router } = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auth);
  const protectRouter = Router();
  protectRouter.use('/users', app.routes.users);
  protectRouter.use('/users/:id', app.routes.users);
  protectRouter.use('/product/:id', app.routes.products);
  app.use('/v1', app.config.passport.authenticate(), protectRouter);
};
