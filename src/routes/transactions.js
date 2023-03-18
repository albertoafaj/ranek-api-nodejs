const { Router } = require('express');
const ValidationsError = require('../err/ValidationsError');

module.exports = (app) => {
  const router = Router();

  const getTransaction = async (bodyAddress, ProductId, userId) => {
    const [address] = await app.services.address.save({ ...bodyAddress });
    const product = await app.services.product.findOne({ id: ProductId });
    const transaction = {
      productId: ProductId, addressId: address.id, buyerId: userId,
    };
    return { product, transaction, address };
  };

  function setResponse(responseDB, product, address) {
    const {
      id, buyerId, dateCreate, dateLastUpdate,
    } = responseDB;
    const response = {
      id, buyerId, product, address, dateCreate, dateLastUpdate,
    };
    return response;
  }

  router.get('/:id', async (req, res, next) => {
    try {
      const result = await app.services.transaction.findOne({ id: parseInt(req.params.id, 10) });
      const address = await app.services.address.findOne({ id: result.addressId });
      const product = await app.services.product.findOne({ id: result.productId });
      const response = setResponse(result, product, address);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      if (typeof req.body.address !== 'object') throw new ValidationsError('O campo endereço deve ser um(a) object');
      const {
        product, transaction, address,
      } = await getTransaction(req.body.address, req.body.productId, req.user.id);
      const [result] = await app.services.transaction.save(transaction, product.userId);
      const response = setResponse(result, product, address);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      if (typeof req.body.address !== 'object') throw new ValidationsError('O campo endereço deve ser um(a) object');
      const {
        id, addressId,
      } = await app.services.transaction.findOne({ id: req.params.id });
      const [address] = await app.services.address.update({ ...req.body.address, id: addressId });
      const product = await app.services.product.findOne({ id: req.body.productId });
      const [result] = await app.services.transaction.update({
        id, buyerId: req.user.id, productId: req.body.productId, addressId,
      }, product.userId);
      const response = setResponse(result, product, address);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      let delAddress;
      let response;
      const {
        id,
        addressId,
      } = await app.services.transaction.findOne({ id: req.params.id });
      const delTransaction = await app.services.transaction.remove(id);
      if (delTransaction > 0) delAddress = await app.services.address.remove(addressId);
      if (delAddress > 0) response = { addressId };
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
