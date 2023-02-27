module.exports = (app) => {
  app.route('/auth/signin')
    .post(app.routes.auth.signin);
  app.route('/auth/signup')
    .post(app.routes.auth.signup);
  app.route('/users')
    .all(app.config.passport.authenticate())
    .get(app.routes.users.findAll)
    .post(app.routes.users.create);
  app.route('/users/:id')
    .all(app.config.passport.authenticate())
    .put(app.routes.users.update);
};
