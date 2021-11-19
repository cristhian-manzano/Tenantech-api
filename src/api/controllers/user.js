const {User} = require("../models/");

const get = async (req, res) => {
  const users = await User.findAll();

  if (!users) return res.status(400).json({ error: "No hay data" });

  res.status(400).json({ data: users });
};

module.exports = {
  get,
};
