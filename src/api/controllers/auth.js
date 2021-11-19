const { User, sequelize } = require("../models/");
const {
  successResponse,
  errorResponse,
  validationResponse,
} = require("../utils/reponses");

const {
  CREATED,
  UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  OK,
} = require("../utils/statusCodes");

const { validateSignin, validateSignup } = require("../validations/auth");

const { createToken, compareEncriptedData } = require("../utils/functions");

const signIn = async (req, res) => {
  const { error } = validateSignin(req.body);

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
    });

    // Optimize this
    if (!user)
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Invalid credentials!"));

    if (!(await compareEncriptedData(password, user.password)))
      return res
        .status(NOT_FOUND)
        .json(errorResponse(res.statusCode, "Invalid credentials!"));
    //--

    const token = createToken({
      id: user.id,
      email: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return res.status(OK).json(
      successResponse(res.statusCode, "User logged succesfully!", {
        token,
        ...user.dataValues,
      })
    );
  } catch (e) {
    console.log(e.message);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse("Server error", res.statusCode));
  }
};

const signUp = async (req, res) => {
  const { error } = validateSignup(req.body);

  if (error)
    return res.status(UNPROCESSABLE_ENTITY).json(
      validationResponse(
        res.statusCode,
        error.details.map((e) => e.message)
      )
    );

  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (user)
      return res
        .status(BAD_REQUEST)
        .json(errorResponse("Email already exists!", res.statusCode));

    await sequelize.transaction(async (t) => {
      const newUser = await User.create(req.body);

      return res
        .status(CREATED)
        .json(
          successResponse(
            res.statusCode,
            "User registered succesfully!",
            newUser
          )
        );
    });
  } catch (e) {
    console.log(e.message);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse("Server error", res.statusCode));
  }
};

module.exports = {
  signIn,
  signUp,
};
