const { Op } = require("sequelize");
const { ROLES } = require("../utils/constants");

const { User } = require("../models/");

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
  BAD_REQUEST,
} = require("../utils/statusCodes");

const {
  validateCreateTenant,
  validateUpdateTenant,
} = require("../validations/tenant");

const getAll = async (req, res) => {
  try {
    const user = await User.findAll({
      where: {
        codeRole: "002",
      },
      attributes: ["id", "idNumber", "email", "firstName", "lastName", "phone"],
    });

    return res
      .status(OK)
      .json(
        successResponse(res.statusCode, "tenants successfully obtained!", user)
      );
  } catch (e) {
    console.log(e.message);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, "Server error"));
  }
};

const create = async (req, res) => {
  const { error } = validateCreateTenant(req.body);

  if (error)
    return res.status(UNPROCESSABLE_ENTITY).json(
      validationResponse(
        res.statusCode,
        error.details.map((e) => e.message)
      )
    );

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: req.body.email }, { idNumber: req.body.idNumber }],
      },
    });

    if (user)
      return res
        .status(BAD_REQUEST)
        .json(errorResponse("User already exists!", res.statusCode));

    // await sequelize.transaction(async (t) => {
    const newUser = await User.create({
      ...req.body,
      codeRole: ROLES.tenant.code,
    });

    return res.status(CREATED).json(
      successResponse(res.statusCode, "tenant created succesfully!", {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      })
    );
    // });
  } catch (e) {
    console.log(e.message);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse("Server error", res.statusCode));
  }
};

const update = async (req, res) => {
  const { error } = validateUpdateTenant(req.body);

  if (error)
    return res.status(UNPROCESSABLE_ENTITY).json(
      validationResponse(
        res.statusCode,
        error.details.map((e) => e.message)
      )
    );

  try {
    const id = req.params.id;

    const [num] = await User.update(req.body, {
      where: { id, codeRole: "002" },
    });

    if (num != 1)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Cannot update tenant!"));

    return res
      .status(OK)
      .json(successResponse(res.statusCode, "tenant updated succesfully!"));
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
    const num = await User.destroy({
      where: { id, codeRole: "002" },
    });

    if (num != 1)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Cannot delete tenant!"));

    return res
      .status(OK)
      .json(successResponse(res.statusCode, "Tenant deleted succesfully!"));
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
