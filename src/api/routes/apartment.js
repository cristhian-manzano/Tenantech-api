const router = require("express").Router();
const { getAll, create, update, destroy } = require("../controllers/apartment");
const { verifyJWT, canAccess } = require("../middlewares/auth");

router.use([verifyJWT, canAccess("001")]);

router
    .get("/", getAll)
    .post("/", create)
    .put("/:id", update)
    .delete("/:id", destroy);

module.exports = router;
