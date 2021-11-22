const Joi = require("joi");

const validateApartment = (data) => {
  const schema = Joi.object({
    code: Joi.string().max(100),
    width: Joi.number(),
    length: Joi.number(),
    floor: Joi.number(),
    monthlyPrice: Joi.number().required(),
    bedroomCount: Joi.number().required(),
    bathroomCount: Joi.number().required(),
    kitchenCount: Joi.number().required(),
    available: Joi.boolean(),
    lightMeter: Joi.string().max(50),
    idProperty: Joi.number().required(),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

module.exports = {
  validateApartment,
};
