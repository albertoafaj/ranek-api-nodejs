const { Router } = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const multerConfig = require('../config/multer');
const ValidationsError = require('../err/ValidationsError');

const updload = multer(multerConfig).array('files');

module.exports = (app) => {
  const router = Router();

  router.post('/', updload, async (req, res, next) => {
    const { files } = req;
    try {
      const result = await app.services.photo.save(req.files, req.body.photoTitles);
      files.forEach((file) => {
        const tempPath = `${path.resolve(__dirname, '..', '..', 'tmp', 'uploads')}/${file.filename}`;
        const finalPath = `${path.resolve(__dirname, '..', '..', 'uploads')}/${file.filename}`;
        fs.rename(tempPath, finalPath, (err) => {
          if (err) throw new ValidationsError(`Não foi possível salvar o arquivo ${file.originalname}`);
        });
      });
      return res.status(200).json(result);
    } catch (error) {
      const tmpUploads = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');
      await files.forEach((file) => {
        fs.unlink(`${tmpUploads}/${file.filename}`, (err) => {
          if (err) throw new ValidationsError(`Não foi possível deletar o arquivo ${file.originalname}`);
        });
      });
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
      const { url } = await app.services.photo.findOne({ id: parseInt(req.params.id, 10) });
      const result = await app.services.photo.remove({ id: parseInt(req.params.id, 10) });
      if (result === 1) {
        fs.unlink(url, () => { });
      }
      return res.status(204).json();
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
