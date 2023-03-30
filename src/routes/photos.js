const { Router } = require('express');
const multer = require('multer');
// const fs = require('fs');
const multerConfig = require('../config/multer');

const updload = multer(multerConfig).array('files');

module.exports = (app) => {
  const router = Router();

  // TODO Implement a maximum limit of 10 photos;
  router.post('/', updload, async (req, res, next) => {
    try {
      const result = await app.services.photo.save(req.files, req.body.photoTitles);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const result = await app.services.photo.findOne({ id: parseInt(req.params.id, 10) });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      /* const { url, productId } = await app.services.photo
        .findOne({ id: parseInt(req.params.id, 10) }); */
      /* const result =  */await app.services.photo
        .remove({ id: parseInt(req.params.id, 10) }/* , productId */);
      /* if (result === 1) {
        fs.unlink(url, () => { });
      } */
      return res.status(204).json();
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
