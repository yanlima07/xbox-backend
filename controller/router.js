var express = require("express");
var router = express.Router();

var authenticate = require("./routes/authenticate");
var pokemons = require("./routes/pokemons");

router.use("/authenticate", authenticate);
router.use("/pokemons", pokemons);

module.exports = router;
