const { Router } = require('express');
const qs = require('qs');

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

  router.get('/:id', async (req, res, next) => {
    try {
      const result = await app.services.product.findOne({ id: req.params.id });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const result = await app.services.product.save({ ...req.body, userId: req.user.id });
      return res.status(200).json(result[0]);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
