const express = require("express");

// Routes
const auth = require("./auth");
const location = require("./location");
const property = require("./property");
const apartment = require("./apartment");

const user = require("./user");

// Implementation

const router = express.Router();

router.use("/auth", auth);
router.use("/location", location);
router.use("/users", user);
router.use("/apartments", apartment);
router.use("/properties", property);

module.exports = router;
