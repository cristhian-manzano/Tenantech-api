const router = require("express").Router();

const { get } = require("../controllers/user");

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.get("/", get);

module.exports = router;
