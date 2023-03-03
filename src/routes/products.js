const { Router } = require('express');
const qs = require('qs');

module.exports = (app) => {
  const router = Router();

  router.get('/', async (req, res, next) => {
    try {
      let result = [];
      const fieldSearch = ['name', 'description'];
      const { keywords, userId } = qs.parse(req.query);
      if (!keywords && !userId) result = await app.services.product.findAll({});
      if (keywords) {
        fieldSearch.forEach((field) => {
          result.push(app.services.product.findQ(field, keywords));
        });
        result = await Promise.all(result).then((data) => data);
        const removeDuplicate = [];
        result.map((duplicate) => duplicate.forEach((el) => {
          if (!removeDuplicate.includes(JSON.stringify(el))) {
            removeDuplicate.push(JSON.stringify(el));
          }
        }));
        result = removeDuplicate;
      }
      if (userId) result = await app.services.product.findAll({ userId });

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
  return router;
};
