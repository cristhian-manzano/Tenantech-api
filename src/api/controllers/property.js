const { Property, Canton } = require("../models/");
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
  NOT_FOUND
} = require("../utils/statusCodes");

const {
  validateCreateProperty,
  validateUpdateProperty,
} = require("../validations/property");

const getAll = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { idOwner: req?.user.id },
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
    const canton = await Canton.findOne({ where: { id: req.body?.idCanton } });

    if (!canton)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Canton does not exists!"));

    const newProperty = await Property.create({
      ...req.body,
      idOwner: req?.user?.id,
    });

    return res
      .status(CREATED)
      .json(
        successResponse(
          res.statusCode,
          "Property registered succesfully!",
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
      .json(successResponse(res.statusCode, "Property updated succesfully!"));
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
    const num = await Property.destroy({ where: { id } });

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
