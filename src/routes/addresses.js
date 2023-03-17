const { Router } = require('express');

module.exports = (app) => {
  const router = Router();

  router.get('/:id', async (req, res, next) => {
    try {
      const result = await app.services.address.findOne({ id: req.params.id });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const result = await app.services.address.save({ ...req.body });
      return res.status(200).json(result[0]);
    } catch (error) {
      return next(error);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const result = await app.services.address
        .update({ ...req.body, id: parseInt(req.params.id, 10) });
      return res.status(200).json(result[0]);
    } catch (error) {
      return next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const result = await app.services.address.remove(parseInt(req.params.id, 10));
      return res.status(204).json(result[0]);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
