require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const encryptData = async (data) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(data, salt);
};

const compareEncriptedData = async (data, encriptedData) => {
  return bcrypt.compare(data, encriptedData);
};

function createToken(data) {
  return jwt.sign(data, process.env.AUTH_JWT_SECRET, {
    expiresIn: 86400,
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.AUTH_JWT_SECRET);
}

module.exports = {
  encryptData,
  createToken,
  compareEncriptedData,
  verifyToken,
};
