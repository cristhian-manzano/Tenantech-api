const { errorResponse } = require("../utils/responses");
const { User } = require("../models/");
const { UNAUTHORIZED, FORBIDDEN } = require("../utils/statusCodes");
const { verifyToken } = require("../utils/functions");

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  const token = authHeader?.replace(/^Bearer\s+/, "");

  if (!authHeader?.startsWith("Bearer ") || !token)
    return res
      .status(FORBIDDEN)
      .json(
        errorResponse(res.statusCode, "No token provided!")
      );

  try {
    const userId = verifyToken(token);
    const user = await User.findByPk(userId?.id);

    if (!user)
      return res
        .status(UNAUTHORIZED)
        .json(
          errorResponse(
            res.statusCode,
            "User associated with token was not found!"
          )
        );

    req.user = user;
    return next();
  } catch (e) {
    console.log(e.message);
    return res
      .status(UNAUTHORIZED)
      .json(errorResponse(res.statusCode, "Invalid token!"));
  }
};

const canAccess =
  (roles = []) =>
  async (req, res, next) => {
    if (roles?.includes(req?.user?.codeRole ?? "")) return next();

    return res
      .status(UNAUTHORIZED)
      .json(errorResponse(res.statusCode, "Unauthorized!"));
  };

module.exports = { verifyJWT, canAccess };
