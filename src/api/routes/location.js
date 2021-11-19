const router = require("express").Router();

const {
  getProvinces,
  getCantonsByProvince,
} = require("../controllers/location");

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router
    .get("/provinces", getProvinces)
    .get("/cantons/:id", getCantonsByProvince);


module.exports = router;
