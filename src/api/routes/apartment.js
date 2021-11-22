const router = require("express").Router();
const { getAll, create } = require("../controllers/apartment");
const {verifyJWT, canAccess} = require('../middlewares/auth')

// middleware that is specific to this router
// router.use([verifyJWT, canAccess("001")]);

router.get("/", getAll).post("/", create);

module.exports = router;
