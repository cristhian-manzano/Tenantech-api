const bcrypt = require("bcrypt");

const encryptData = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data, salt);
  return hash;
};

module.exports = {
  encryptData,
};
