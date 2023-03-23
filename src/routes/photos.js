const { Router } = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const multerConfig = require('../config/multer');
const ValidationsError = require('../err/ValidationsError');

const updload = multer(multerConfig).array('files');

const saveFile = (req, res, next) => {
  console.log('save');
  console.log('save', res.statusCode);
  res.on('finish', () => {
    const { files } = req;
    if (res.statusCode === 200) {
      files.forEach((file) => {
        const tempPath = `${path.resolve(__dirname, '..', '..', 'tmp', 'uploads')}/${file.filename}`;
        const finalPath = `${path.resolve(__dirname, '..', '..', 'uploads')}/${file.filename}`;
        fs.rename(tempPath, finalPath, (err) => {
          if (err) throw new ValidationsError(`Não foi possível salvar o arquivo ${file.originalname}`);
          console.log(`O arquivo ${file.originalname} foi salvo com sucesso!`);
        });
      });
    } else {
      const tmpUploads = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');
      files.forEach((file) => {
        fs.unlink(`${tmpUploads}/${file.filename}`, (err) => {
          if (err) throw new ValidationsError(`Não foi possível deletar o arquivo ${file.originalname}`);

          console.log(`O arquivo ${file.originalname} foi deletado!`);
        });
      });
    }
  });

  next();
};

module.exports = (app) => {
  const router = Router();

  router.post('/', updload, saveFile, async (req, res, next) => {
    try {
      const result = await app.services.photo.save(req.files, req.body);

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
