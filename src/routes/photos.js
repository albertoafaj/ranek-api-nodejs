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
      const result = await app.services.photo.save(req.files, req.body);
      files.forEach((file) => {
        const tempPath = `${path.resolve(__dirname, '..', '..', 'tmp', 'uploads')}/${file.filename}`;
        const finalPath = `${path.resolve(__dirname, '..', '..', 'uploads')}/${file.filename}`;
        fs.rename(tempPath, finalPath, (err) => {
          if (err) throw new ValidationsError(`Não foi possível salvar o arquivo ${file.originalname}`);
          // console.log(`O arquivo ${file.originalname} foi salvo com sucesso!`);
        });
      });
      return res.status(200).json(result);
    } catch (error) {
      const tmpUploads = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');
      await files.forEach((file) => {
        fs.unlink(`${tmpUploads}/${file.filename}`, (err) => {
          if (err) throw new ValidationsError(`Não foi possível deletar o arquivo ${file.originalname}`);
          // console.log(`O arquivo ${file.originalname} foi deletado!`);
        });
      });
      return next(error);
    }
  });

  return router;
};
