const express = require("express");

// Routes
const auth = require("./auth");

// Implementation

const router = express.Router();

router.use("/auth", auth);

module.exports = router;
