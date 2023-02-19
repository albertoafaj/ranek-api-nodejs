module.exports = (app) => {
  app.route('/auth/signin')
    .post(app.routes.auth.signin);
  app.route('/users')
    .get(app.routes.users.findAll)
    .post(app.routes.users.create);
  app.route('/users/:id')
    .put(app.routes.users.update);
};
