const Joi = require("joi");

const validateProperty = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(100),
    apartmentsNumber: Joi.number().required(),
    totalFloors: Joi.number().required(),
    address: Joi.string().max(255).required(),
    zipCode: Joi.string().max(50),
    idCanton: Joi.number().required(),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

module.exports = {
  validateProperty,
};
