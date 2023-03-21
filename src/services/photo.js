const FieldValidator = require('../models/FieldValidator');
const dataValidator = require('../utils/dataValidator');
const Photos = require('../models/Photos');

module.exports = (app) => {
  const photoValidator = new Photos(
    { ...new FieldValidator('id da foto', 0, 2147483647, 'number', true, true, true) },
    { ...new FieldValidator('fieldname da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('originalname da foto do produto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('encoding da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('mimetype da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('destination da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('filename da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('path da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('size da foto', 0, 16, 'number', true, true, true) },
    { ...new FieldValidator('title da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('data de criação do produto', 0, 255, 'string', false, true, true) },
  );

  const save = async (photo) => {
    dataValidator(photo, 'foto', photoValidator, false, true, false, true, true);
    return app.db('photos').insert(photo, '*');
  };

  return {
    save,
  };
};
