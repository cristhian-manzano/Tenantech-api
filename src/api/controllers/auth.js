const { Op } = require("sequelize");
const { ROLES } = require("../utils/constants");
const { User, Role, sequelize } = require("../models/");
const {
  successResponse,
  errorResponse,
  validationResponse,
} = require("../utils/responses");

const {
  CREATED,
  UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  OK,
} = require("../utils/statusCodes");

const { validateSignIn, validateSignUp } = require("../validations/auth");
const { createToken, compareEncriptedData } = require("../utils/functions");

const signIn = async (req, res) => {
  const { error } = validateSignIn(req.body);

  if (error)
    return res.status(UNPROCESSABLE_ENTITY).json(
      validationResponse(
        res.statusCode,
        error.details.map((e) => e.message)
      )
    );

  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
      include: {
        model: Role,
        as: "role",
      },
    });

    if (!user || !(await compareEncriptedData(password, user.password)))
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Invalid credentials!"));

    const token = createToken({ id: user.id });

    return res.status(OK).json(
      successResponse(res.statusCode, "User logged successfully!", {
        token,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
      })
    );
  } catch (e) {
    console.log(e.message);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, "Server error"));
  }
};

const signUp = async (req, res) => {
  const { error } = validateSignUp(req.body);

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

    const role = await Role.findOne({
      where: {
        name: ROLES.Administrator.name,
      },
    });

    if (!role)
      return res
        .status(UNPROCESSABLE_ENTITY)
        .json(errorResponse("Role does not exists!", res.statusCode));

    const newUser = await User.create({
      ...req.body,
      idRole: role?.id,
    });

    return res.status(CREATED).json(
      successResponse(res.statusCode, "User registered successfully!", {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      })
    );
  } catch (e) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse("Server error", res.statusCode));
  }
};

module.exports = {
  signIn,
  signUp,
};
