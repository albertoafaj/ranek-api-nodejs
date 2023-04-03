const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = (app) => {
  app.use(bodyParser.json());
  // TODO define cors polit
  app.use(cors({ origin: '*' }));
};
