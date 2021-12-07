const Joi = require("joi");

const validateSignIn = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(40).required(),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

const validateSignUp = (data) => {
  const schema = Joi.object({
    email: Joi.string().max(50).email().required(),
    password: Joi.string().min(5).max(40).required(),
    idNumber: Joi.string().max(20).required(),
    firstName: Joi.string().max(75).required(),
    lastName: Joi.string().max(75).required(),
    phone: Joi.string().max(20),
    details: Joi.object(),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

module.exports = {
  validateSignIn,
  validateSignUp,
};
