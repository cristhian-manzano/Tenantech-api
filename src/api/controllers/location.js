const { Canton, Province } = require("../models/");
const { errorResponse, successResponse } = require("../utils/responses");
const { INTERNAL_SERVER_ERROR, OK } = require("../utils/statusCodes");

const getCantonsByProvince = async (req, res) => {
  try {
    const cantons = await Canton.findAll({
      where: { idProvince: req.params.id },
    });

    return res
      .status(OK)
      .json(
        successResponse(
          res.statusCode,
          "cantons successfully obtained!",
          cantons
        )
      );
  } catch (e) {
    console.log(e.message);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, "Server error" ));
  }
};

const getProvinces = async (req, res) => {
  try {
    const provinces = await Province.findAll();

    return res
      .status(OK)
      .json(
        successResponse(
          res.statusCode,
          "cities successfully obtained!",
          provinces
        )
      );
  } catch (e) {
    console.log(e.message);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode,"Server error" ));
  }
};

module.exports = {
  getCantonsByProvince,
  getProvinces,
};
