const router = require("express").Router();

const { getAll, create } = require("../controllers/apartment");

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.get("/", getAll).post("/", create);

module.exports = router;
