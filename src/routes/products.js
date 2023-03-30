const { Router } = require('express');
const qs = require('qs');
const multer = require('multer');
const multerConfig = require('../config/multer');
const Products = require('../models/Products');

const updload = multer(multerConfig).array('files');

module.exports = (app) => {
  const router = Router();

  router.get('/', async (req, res, next) => {
    try {
      let result = [];
      const limitDefault = 9;
      const pageDefault = 1;
      const {
        keywords, userId, limit, page,
      } = qs.parse(req.query);
      if (userId) result = await app.services.product.findAll({ userId });
      if (!keywords && !userId) result = await app.services.product.findAll({});
      if (keywords) result = await app.services.product.findKeyWord(keywords);
      res.append('x-total-count', JSON.stringify(result.length));
      if (page || limit) {
        let pageNumber = page;
        let productsPerPage = limit;
        if (!page) pageNumber = pageDefault;
        if (!limit) productsPerPage = limitDefault;
        result = result
          .slice((pageNumber - 1) * productsPerPage, pageNumber * parseInt(productsPerPage, 10));
      }
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  // TODO check whether to allow user to get products from other users
  router.get('/:id', async (req, res, next) => {
    try {
      const result = await app.services.product.findOne({ id: parseInt(req.params.id, 10) });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.post('/', updload, async (req, res, next) => {
    try {
      const product = new Products();
      const {
        id, dateCreate, dateLastUpdate, sold, photos, ...productFields
      } = product;
      Object.entries(req.body).forEach(([key, value]) => {
        try {
          productFields[key] = JSON.parse(value);
        } catch (error) {
          productFields[key] = value;
        }
      });
      if (req.files !== undefined) {
        productFields.photos = await app.services.photo.save(req.files, req.body.photoTitles);
      }
      const { photoTitles, ...saveProduct } = productFields;
      const result = await app.services.product.save({ ...saveProduct, userId: req.user.id });
      return res.status(200).json(result[0]);
    } catch (error) {
      return next(error);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const result = await app.services.product.update({
        ...req.body, id: parseInt(req.params.id, 10), userId: req.user.id,
      });
      return res.status(200).json(result[0]);
    } catch (error) {
      return next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const result = await app.services.product.remove(parseInt(req.params.id, 10), req.user.id);
      return res.status(204).json(result[0]);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
