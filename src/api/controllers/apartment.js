const { Apartment, Property, MeterService, sequelize } = require("../models/");

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
  validateCreateApartment,
  validateUpdateApartment,
} = require("../validations/apartment");

const getAll = async (req, res) => {
  try {
    const apartment = await Apartment.findAll({
      attributes: {
        exclude: ["idProperty", "idMeterServices"],
      },
      include: [
        {
          model: Property,
          as: "property",
          where: {
            idOwner: req?.user.id,
          },
          attributes: ["id", "name"],
        },
        {
          model: MeterService,
          as: "meterServices",
        },
      ],
    });

    return res
      .status(OK)
      .json(
        successResponse(
          res.statusCode,
          "apartments successfully obtained!",
          apartment
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
  const { error } = validateCreateApartment(req.body);

  if (error)
    return res.status(UNPROCESSABLE_ENTITY).json(
      validationResponse(
        res.statusCode,
        error.details.map((e) => e.message)
      )
    );

  try {
    const property = await Property.findOne({
      where: { id: req.body.idProperty, idOwner: req?.user?.id },
    });

    if (!property)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Property not found!"));

    const newApartment = await sequelize.transaction(async (t) => {
      const newMeterService = await MeterService.create(
        {
          lightMeter: req.body?.lightMeter,
          waterMeter: req.body?.waterMeter,
        },
        { transaction: t }
      );

      return Apartment.create(
        { ...req.body, idMeterServices: newMeterService.id },
        { transaction: t }
      );
    });

    return res
      .status(CREATED)
      .json(
        successResponse(
          res.statusCode,
          "Apartment registered successfully!",
          newApartment
        )
      );
  } catch (e) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, "Server error"));
  }
};

const update = async (req, res) => {
  const { error } = validateUpdateApartment(req.body);

  if (error)
    return res.status(UNPROCESSABLE_ENTITY).json(
      validationResponse(
        res.statusCode,
        error.details.map((e) => e.message)
      )
    );

  const t = await sequelize.transaction();

  try {
    let apartment = await Apartment.findOne({
      where: {
        id: req.params?.id,
      },

      include: {
        model: Property,
        as: "property",
        where: {
          idOwner: req.user?.id,
        },
      },
    });

    if (!apartment)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Apartment not found"));

    apartment = Object.assign(apartment, req.body);
    const updatedApartment = await apartment.save({ transaction: t });

    if (req.body?.lightMeter || req.body?.waterMeter) {
      const [updatedMeterServices] = await MeterService.update(
        {
          lightMeter: req.body.lightMeter,
          waterMeter: req.body.waterMeter,
        },
        {
          where: {
            id: updatedApartment?.idMeterServices,
          },
          transaction: t,
        }
      );
      if (updatedMeterServices != 1) {
        await t.rollback();
        return res
          .status(NOT_FOUND)
          .json(errorResponse(res.statusCode, "Cannot update apartment!"));
      }
    }
    await t.commit();
    return res
      .status(OK)
      .json(successResponse(res.statusCode, "Apartment updated successfully!"));
  } catch (e) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, "Server error"));
  }
};

const destroy = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const apartment = await Apartment.findOne({
      where: {
        id: req.params?.id,
      },
      include: {
        model: Property,
        as: "property",
        where: {
          idOwner: req.user?.id,
        },
      },
    });

    if (!apartment)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Apartment not found"));

    const apartmentDeleted = await Apartment.destroy({
      where: {
        id: apartment.id,
      },
      transaction: t,
    });

    const meterServiceDeleted = await MeterService.destroy({
      where: {
        id: apartment.idMeterServices,
      },
      transaction: t,
    });

    if (meterServiceDeleted != 1 || apartmentDeleted != 1) {
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
