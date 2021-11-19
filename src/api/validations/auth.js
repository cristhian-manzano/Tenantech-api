const Joi = require("joi");

const validateSignin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(40).required(),
  });

  return schema.validate(data);
};

const validateSignup = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(40).required(),
    idNumber: Joi.string().max(20).required(),
    firstName: Joi.string().max(20).required(),
    lastName: Joi.string().max(20).required(),
    phone: Joi.string().max(20),
    details: Joi.object(),
    //IDROLE
  }).options({ abortEarly: false });

  return schema.validate(data);
};

module.exports = {
  validateSignin,
  validateSignup,
};
