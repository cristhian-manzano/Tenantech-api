const { Apartment } = require("../models/");

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
} = require("../utils/statusCodes");

const { validateApartment } = require("../validations/apartment");

const getAll = async (req, res) => {
  try {
    const apartment = await Apartment.findAll();

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
      .json(errorResponse(res.statusCode, "Server error" ));
  }
};

const create = async (req, res) => {
  const { error } = validateApartment(req.body);

  if (error)
    return res.status(UNPROCESSABLE_ENTITY).json(
      validationResponse(
        res.statusCode,
        error.details.map((e) => e.message)
      )
    );

  try {
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
      .json(errorResponse(res.statusCode, "Server error" ));
  }
};

module.exports = {
  getAll,
  create,
};
