const { Apartment, Property } = require("../models/");

const {
  errorResponse,
  successResponse,
  validationResponse,
} = require("../utils/reponses");

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
      include: {
        model: Property,
        as: "property",
        where: {
          idOwner: req?.user.id,
        },
        attributes: [],
      },
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

    const newApartment = await Apartment.create(req.body);

    return res
      .status(CREATED)
      .json(
        successResponse(
          res.statusCode,
          "Apartment registered succesfully!",
          newApartment
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
  const { error } = validateUpdateApartment(req.body);

  if (error)
    return res.status(UNPROCESSABLE_ENTITY).json(
      validationResponse(
        res.statusCode,
        error.details.map((e) => e.message)
      )
    );

  try {
    const id = req.params.id;

    const [num] = await Apartment.update(req.body, {
      where: { id },
      include: {
        model: Property,
        as: "property",
        where: {
          idOwner: req?.user.id,
        },
      },
    });

    if (num != 1)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Cannot update apartment!"));

    return res
      .status(OK)
      .json(successResponse(res.statusCode, "Apartment updated succesfully!"));
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
    const num = await Apartment.destroy({
      where: { id },
      include: {
        model: Property,
        as: "property",
        where: {
          idOwner: req?.user.id,
        },
      },
    });

    if (num != 1)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Cannot delete property!"));

    return res
      .status(OK)
      .json(successResponse(res.statusCode, "Property deleted succesfully!"));
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
