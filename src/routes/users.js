module.exports = (app) => {
  const findAll = async (req, res) => {
    const users = await app.services.user.findAll();
    res.status(200).json(users);
  };

  const create = async (req, res) => {
    const result = await app.services.user.save(req.body);
    if (result.error) return res.status(400).json(result);
    return res.status(201).json(result[0]);
  };

  return { findAll, create };
};
