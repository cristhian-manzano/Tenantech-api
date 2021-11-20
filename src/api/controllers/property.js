const { Property } = require("../models/");
const {
  errorResponse,
  successResponse,
  validationResponse,
} = require("../utils/reponses");
const {
  INTERNAL_SERVER_ERROR,
  OK,
  UNPROCESSABLE_ENTITY,
  CREATED
} = require("../utils/statusCodes");

const { validateProperty } = require("../validations/property");

const getAll = async (req, res) => {
  try {
    const properties = await Property.findAll();

    return res.status(OK).json(
      successResponse(res.statusCode, "properties successfully obtained!", {
        properties,
      })
    );
  } catch (e) {
    console.log(e.message);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse("Server error", res.statusCode));
  }
};

const create = async (req, res) => {
  const { error } = validateProperty(req.body);

  if (error)
    return res.status(UNPROCESSABLE_ENTITY).json(
      validationResponse(
        res.statusCode,
        error.details.map((e) => e.message)
      )
    );

  try {
    const newProperty = await Property.create(req.body);

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
      .json(errorResponse("Server error", res.statusCode));
  }
};

module.exports = {
  getAll,
  create,
};
