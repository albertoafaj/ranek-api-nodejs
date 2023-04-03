const express = require('express');
const app = require('./app');

const port = 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Aplicação ativa na porta ${port}`);
});
