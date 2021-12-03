const { Property, Canton, MeterService, sequelize } = require("../models/");
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
      attributes: {
        exclude: ["idOwner", "idMeterServices"],
      },
      include: {
        model: MeterService,
        as: "meterServices",
      },
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
    const canton = await Canton.findOne({ where: { id: req.body.idCanton } });

    if (!canton)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Canton does not exists!"));

    const newProperty = await sequelize.transaction(async (t) => {
      const meterServices = await MeterService.create(
        {
          lightMeter: req.body?.lightMeter,
          waterMeter: req.body?.waterMeter,
        },
        { transaction: t }
      );

      return Property.create(
        {
          ...req.body,
          idOwner: req.user?.id,
          idMeterServices: meterServices.id,
        },
        { transaction: t }
      );
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

  const t = await sequelize.transaction();

  try {
    const id = req.params.id;

    let property = await Property.findOne({
      where: { id, idOwner: req.user?.id },
    });

    if (!property)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Cannot find property!"));

    property = Object.assign(property, { ...req.body });

    const updatedProperty = await property.save({ transaction: t });

    if (req.body.lightMeter || req.body.waterMeter) {
      const [numMeterServices] = await MeterService.update(
        {
          lightMeter: req.body.lightMeter,
          waterMeter: req.body.waterMeter,
        },
        {
          where: {
            id: updatedProperty?.idMeterServices,
          },
          transaction: t,
        }
      );

      if (numMeterServices != 1) {
        await t.rollback();
        return res
          .status(NOT_FOUND)
          .json(errorResponse(res.statusCode, "Cannot update property!"));
      }
    }
    await t.commit();
    return res
      .status(OK)
      .json(successResponse(res.statusCode, "Property updated!"));
  } catch (e) {
    await t.rollback();
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, "Server error"));
  }
};

const destroy = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const id = req.params.id;
    let property = await Property.findOne({
      where: { id, idOwner: req.user?.id },
    });

    if (!property)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Property not found!"));

    const numProperty = await Property.destroy({
      where: { id, idOwner: req?.user.id },
      transaction: t,
    });

    const numMeterService = await MeterService.destroy({
      where: {
        id: property?.idMeterServices,
      },
      transaction: t,
    });

    if (numProperty != 1 || numMeterService != 1) {
      await t.rollback();
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Cannot delete property!"));
    }

    await t.commit();

    return res
      .status(OK)
      .json(successResponse(res.statusCode, "Property deleted successfully!"));
  } catch (err) {
    console.log(e.message);
    await t.rollback();
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
