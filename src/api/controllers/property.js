const { Property, Canton, MeterService } = require("../models/");
const {
  errorResponse,
  successResponse,
  validationResponse,
} = require("../utils/responses");
const {
  INTERNAL_SERVER_ERROR,
  OK,
  UNPROCESSABLE_ENTITY,
  CREATED,
  NOT_FOUND,
} = require("../utils/statusCodes");

const {
  validateCreateProperty,
  validateUpdateProperty,
} = require("../validations/property");

const getAll = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { idOwner: req.user?.id },
    });

    return res
      .status(OK)
      .json(
        successResponse(
          res.statusCode,
          "properties successfully obtained!",
          properties
        )
      );
  } catch (e) {
    console.log(e.message);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, "Server error"));
  }
};

const create = async (req, res) => {
  const { error } = validateCreateProperty(req.body);

  if (error)
    return res.status(UNPROCESSABLE_ENTITY).json(
      validationResponse(
        res.statusCode,
        error.details.map((e) => e.message)
      )
    );

  try {
    const { idCanton, lightMeter, waterMeter } = req.body;
    const canton = await Canton.findOne({ where: { id: idCanton } });

    if (!canton)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Canton does not exists!"));

    const meterServices =
      lightMeter || waterMeter
        ? await MeterService.create({
            lightMeter: lightMeter,
            waterMeter: waterMeter,
          })
        : null;

    const newProperty = await Property.create({
      ...req.body,
      idOwner: req.user?.id,
      idMeterServices: meterServices?.id,
    });

    return res
      .status(CREATED)
      .json(
        successResponse(
          res.statusCode,
          "Property registered successfully!",
          newProperty
        )
      );
  } catch (e) {
    console.log(e.message);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, "Server error"));
  }
};

const update = async (req, res) => {
  const { error } = validateUpdateProperty(req.body);

  if (error)
    return res.status(UNPROCESSABLE_ENTITY).json(
      validationResponse(
        res.statusCode,
        error.details.map((e) => e.message)
      )
    );

  try {
    const id = req.params.id;

    const [num] = await Property.update(req.body, {
      where: { id, idOwner: req?.user.id },
    });

    if (num != 1)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Cannot update property!"));

    return res
      .status(OK)
      .json(successResponse(res.statusCode, "Property updated successfully!"));
  } catch (e) {
    console.log(e.message);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, "Server error"));
  }
};

const destroy = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Property.destroy({
      where: { id, idOwner: req?.user.id },
    });

    if (num != 1)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Cannot delete property!"));

    return res
      .status(OK)
      .json(successResponse(res.statusCode, "Property deleted successfully!"));
  } catch (err) {
    console.log(e.message);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, "Server error"));
  }
};

module.exports = {
  getAll,
  create,
  update,
  destroy,
};
