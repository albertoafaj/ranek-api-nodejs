const { Router } = require('express');

module.exports = (app) => {
  const router = Router();

  router.get('/:id', async (req, res, next) => {
    try {
      const result = await app.db('products').where({ id: req.params.id }).select();
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
