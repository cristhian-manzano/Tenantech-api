const express = require("express");

// Routes
const auth = require("./auth");
const location = require("./location");
const user = require("./user");

// Implementation

const router = express.Router();

router.use("/auth", auth);
router.use("/location", location);
router.use("/users", user);

module.exports = router;
