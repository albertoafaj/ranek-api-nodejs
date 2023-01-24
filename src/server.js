const express = require('express');

const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.status(200).send();
});

app.listen(port);
