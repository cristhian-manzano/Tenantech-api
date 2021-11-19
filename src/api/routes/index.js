const express = require("express");

// Routes
const auth = require("./auth");

const user = require("./user");

// Implementation

const router = express.Router();

router.use("/auth", auth);
router.use("/users", user);

module.exports = router;
