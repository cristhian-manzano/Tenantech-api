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
} = require("../utils/statusCodes");

const { validateSignin, validateSignup } = require("../validations/auth");

const signIn = async (req, res) => {};

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
