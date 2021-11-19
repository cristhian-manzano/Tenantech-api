require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const encryptData = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data, salt);
  return hash;
};

const compareEncriptedData = async (data, encriptedData) => {
  return bcrypt.compare(data, encriptedData);
};

function createToken(data) {
  return jwt.sign(data, process.env.AUTH_JWT_SECRET, {
    expiresIn: 86400,
  });
}

module.exports = {
  encryptData,
  createToken,
  compareEncriptedData,
};
