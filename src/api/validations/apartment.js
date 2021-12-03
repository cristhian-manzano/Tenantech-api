const Joi = require("joi");

const validateCreateApartment = (data) => {
  const schema = Joi.object({
    code: Joi.string().max(100),
    width: Joi.number(),
    length: Joi.number(),
    floor: Joi.number().required(),
    bedroomCount: Joi.number().required(),
    bathroomCount: Joi.number().required(),
    kitchenCount: Joi.number().required(),
    monthlyPrice: Joi.number(),
    available: Joi.boolean(),
    lightIncluded: Joi.boolean(),
    waterIncluded: Joi.boolean(),
    internetIncluded: Joi.boolean(),
    furnished: Joi.boolean(),
    lightMeter: Joi.string().max(50),
    waterMeter: Joi.string().max(50),
    idProperty: Joi.number().required(),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

const validateUpdateApartment = (data) => {
  const schema = Joi.object({
    code: Joi.string().max(100),
    width: Joi.number(),
    length: Joi.number(),
    floor: Joi.number(),
    monthlyPrice: Joi.number(),
    bedroomCount: Joi.number(),
    bathroomCount: Joi.number(),
    kitchenCount: Joi.number(),
    available: Joi.boolean(),
    lightIncluded: Joi.boolean(),
    waterIncluded: Joi.boolean(),
    internetIncluded: Joi.boolean(),
    furnished: Joi.boolean(),
    lightMeter: Joi.string().max(25),
    waterMeter: Joi.string().max(25),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

module.exports = {
  validateCreateApartment,
  validateUpdateApartment,
};
