const router = require("express").Router();
const { getAll, create, update, destroy } = require("../controllers/property");
const { verifyJWT, canAccess } = require("../middlewares/auth");
// middleware that is specific to this router
router.use([verifyJWT, canAccess("001")]);

router
    .get("/", getAll)
    .post("/", create)
    .put("/:id", update)
    .delete("/:id", destroy);

module.exports = router;
