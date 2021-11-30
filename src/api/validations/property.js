const Joi = require("joi");

const validateCreateProperty = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(100),
    apartmentsNumber: Joi.number().required(),
    totalFloors: Joi.number().required(),
    address: Joi.string().max(255).required(),
    zipCode: Joi.string().max(50),
    lightMeter: Joi.string().max(25),
    waterMeter: Joi.string().max(25),
    idCanton: Joi.number().required(),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

const validateUpdateProperty = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(100),
    apartmentsNumber: Joi.number().required(),
    totalFloors: Joi.number().required(),
    lightMeter: Joi.string().max(25),
    waterMeter: Joi.string().max(25),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

module.exports = {
  validateCreateProperty,
  validateUpdateProperty,
};
