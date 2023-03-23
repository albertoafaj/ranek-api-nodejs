const FieldValidator = require('../models/FieldValidator');
const dataValidator = require('../utils/dataValidator');
const Photos = require('../models/Photos');
const ValidationsError = require('../err/ValidationsError');

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

  const save = async (photos, titles) => {
    const titleList = Object.values(titles).map((title) => title);
    if (photos.length === 0) throw new ValidationsError('Nenhuma foto foi selecionada');
    if (photos.length > titleList.length) throw new ValidationsError(`Foi(Foram) enviada(s) ${photos.length} foto(s) e informado apenas ${titleList.length} título(os)`);
    const body = photos.map((photo, index) => ({ ...photo, title: titleList[index] }));
    let response = [];
    body.forEach((photo) => {
      dataValidator(photo, 'foto', photoValidator, false, true, false, true, true);
      response.push(app.db('photos').insert(photo, '*'));
    });
    response = await Promise.all(response).then((data) => data.map((el) => el[0]));
    return response;
  };

  return {
    save,
  };
};
