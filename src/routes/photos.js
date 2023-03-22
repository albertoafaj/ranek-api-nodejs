const { Router } = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const multerConfig = require('../config/multer');

const updload = multer(multerConfig).array('files');

const saveFile = (req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode === 200) {
      const { files } = req;
      files.forEach((file) => {
        const tempPath = `${path.resolve(__dirname, '..', '..', 'tmp', 'uploads')}/${file.filename}`;
        const finalPath = `${path.resolve(__dirname, '..', '..', 'uploads')}/${file.filename}`;
        // TODO clean folder tmp/uploads after save
        fs.rename(tempPath, finalPath, (err) => {
          if (err) throw err;
          console.log('Arquivo salvo com sucesso!');
        });
        /*           fs.unlink(tempPath, (err) => {
                    if (err) {
                      console.error(err);
                      return;
                    console.log(`Arquivo ${tempPath} removido com sucesso!`);
                    }
                  }); */
      });
    }
  });
  next();
};

module.exports = (app) => {
  const router = Router();

  router.post('/', updload, saveFile, async (req, res, next) => {
    try {
      console.log(req.files);
      // console.log(req.body);

      // const body = { ...req.file, title: req.body.title };
      const [result] = await app.services.photo.save(req.files, req.body);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
