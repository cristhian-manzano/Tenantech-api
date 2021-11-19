const router = require("express").Router();
const { signUp } = require("../controllers/auth");

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router
  .post("/signin", (req, res) => {
    res.send("Signing");
  })
  .post("/signup", signUp);

module.exports = router;
