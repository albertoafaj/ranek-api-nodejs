const { Router } = require('express');

module.exports = (app) => {
  const router = Router();

  router.get('/', async (req, res, next) => {
    try {
      const userId = req.query.user_id;
      let result;
      if (userId) result = await app.services.product.findAll({ user_id: userId });
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
