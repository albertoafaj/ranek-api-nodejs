const fs = require('fs');
const p = require('path');
const FieldValidator = require('../models/FieldValidator');
const dataValidator = require('../utils/dataValidator');
const Photos = require('../models/Photos');
const ValidationsError = require('../err/ValidationsError');

module.exports = (app) => {
  const photoValidator = new Photos(
    { ...new FieldValidator('id da foto', 0, 255, 'number', false, false, true) },
    { ...new FieldValidator('fieldname da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('originalname da foto do produto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('encoding da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('mimetype da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('destination da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('filename da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('size da foto', 0, 16, 'number', false, false, true) },
    { ...new FieldValidator('url da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('title da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('data de criação do produto', 0, 255, 'string', false, true, true) },
    { ...new FieldValidator('produto Id da foto', 0, 255, 'number', false, false, true) },
  );

  const save = async (photos, titles) => {
    try {
      let titlesArr = [];
      if (typeof titles === 'string') {
        titlesArr.push(titles);
      } else {
        titlesArr = titles;
      }
      if (titlesArr === undefined) throw new ValidationsError('Nenhuma título de foto foi informado');
      if (photos.length === 0) throw new ValidationsError('Nenhuma foto foi selecionada');
      if (photos.length > titlesArr.length) throw new ValidationsError(`Foi(Foram) enviada(s) ${photos.length} foto(s) e informado apenas ${titlesArr.length} título(os)`);
      const body = photos.map((photo, index) => {
        const { path, ...newData } = photo;
        const data = {
          ...newData,
          destination: photo.destination.replace('tmp\\', ''),
          url: path.replace('tmp\\', ''),
          title: titlesArr[index],
        };
        return data;
      });
      let response = [];
      body.forEach((photo) => {
        dataValidator(photo, 'foto', photoValidator, false, true, false, true, true);
        response.push(app.db('photos').insert(photo, '*'));
      });
      response = await Promise.all(response).then((data) => data.map((el) => el[0]));
      photos.forEach((file) => {
        const tempPath = `${p.resolve(__dirname, '..', '..', 'tmp', 'uploads')}/${file.filename}`;
        const finalPath = `${p.resolve(__dirname, '..', '..', 'uploads')}/${file.filename}`;
        fs.rename(tempPath, finalPath, (err) => {
          if (err) throw new ValidationsError(`Não foi possível salvar o arquivo ${file.originalname}`);
        });
      });
      return response;
    } catch (error) {
      const tmpUploads = p.resolve(__dirname, '..', '..', 'tmp', 'uploads');
      await photos.forEach((file) => {
        fs.unlink(`${tmpUploads}/${file.filename}`, (err) => {
          if (err) throw new ValidationsError(`Não foi possível deletar o arquivo ${file.originalname}`);
        });
      });
      throw error;
    }
  };

  const findOne = async (id) => {
    const photo = await app.db('photos').where(id).first();
    return photo;
  };

  const updateProductId = async (products) => {
    let productsData = products[0];
    let { photos } = productsData;
    photos = await photos.map(async (photo) => {
      const updated = {
        ...photo,
        productId: productsData.id,
      };
      return app.db('photos').where({ id: photo.id }).update(updated, '*');
    });
    photos = await Promise.all(photos).then((data) => data.map((el) => el[0]));
    productsData.photos = photos;
    delete productsData.dateCreate;
    delete productsData.dateLastUpdate;
    productsData = await app.services.product.update(productsData);
    return productsData;
  };

  const remove = async (id) => {
    const { url, productId } = await app.services.photo
      .findOne(id);
    if (productId !== null) throw new ValidationsError('A foto não pode ser deletada, pois está relacionda a o produto 10011. Acesse o produto para remover');
    const photo = await app.db('photos').where(id).delete();
    if (photo === 1) { fs.unlink(url, () => { }); }
    return photo;
  };

  return {
    save, findOne, remove, updateProductId, photoValidator,
  };
};
