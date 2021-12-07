const router = require("express").Router();
const { signUp, signIn } = require("../controllers/auth");

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.post("/signIn", signIn).post("/signUp", signUp);

module.exports = router;
