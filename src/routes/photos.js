const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('../config/multer');

const updload = multer(multerConfig).single('file');

module.exports = (app) => {
  const router = Router();

  router.post('/', updload, async (req, res, next) => {
    try {
      const body = { ...req.file, title: req.body.title };
      const { path, title } = await app.services.photo.save(body);
      const response = {
        src: path,
        title,
      };
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
