const app = require('express')();
const consign = require('consign');

consign({ cwd: 'src', verbose: false })
  .include('./config/middlewares.js')
  .into(app);

app.get('/', (req, res) => {
  res.status(200).send();
});

app.get('/user', (req, res) => {
  const users = [
    {
      name: 'Peter Parker',
      email: 'peter@email.com',
    },
  ];
  res.status(200).json(users);
});

app.post('/user', (req, res) => {
  res.status(201).json(req.body);
});

module.exports = app;
