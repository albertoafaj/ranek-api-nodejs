const { Router } = require('express');

module.exports = (app) => {
  const router = Router();
  router.get('/', async (req, res, next) => {
    try {
      const users = await app.services.user.findAll();
      return res.status(200).json(users);
    } catch (error) {
      return next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const result = await app.services.user.save(req.body);
      if (result.error) return res.status(400).json(result);
      return res.status(201).json(result[0]);
    } catch (error) {
      return next(error);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const result = await app.services.user.update(req.params.id, req.body);
      return res.status(200).json(result[0]);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
