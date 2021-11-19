const router = require("express").Router();

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router
  .post("signin", (req, res) => {
    res.send("Signing");
  })
  .post("signup", (req, res) => {
    res.send("Signing");
  });

module.exports = router;
