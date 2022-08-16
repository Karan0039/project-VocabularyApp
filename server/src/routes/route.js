const express = require('express');
const route = express.Router();
const { getMeaning } = require("../controller/dictController")

route.get("/:word", getMeaning)

module.exports = route 