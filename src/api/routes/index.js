const express = require("express");

// Routes
const auth = require("./auth");
const location = require("./location");
const property = require("./property");
const user = require("./user");

// Implementation

const router = express.Router();

router.use("/auth", auth);
router.use("/location", location);
router.use("/users", user);
router.use("/properties", property);

module.exports = router;
