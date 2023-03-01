module.exports = (app) => {
  const findOne = (filter) => app.db('products').where(filter).first();
  const save = async (product) => app.db('products').insert(product, '*');
  return { findOne, save };
};
