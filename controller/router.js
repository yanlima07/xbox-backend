var express = require("express");
var router = express.Router();

var authenticate = require("./routes/authenticate");
var pokemons = require("./routes/pokemons");
var searchPokemons = require("./routes/searchPokemons");

router.use("/authenticate", authenticate);
router.use("/pokemons", pokemons);
router.use("/searchPokemons", searchPokemons);

module.exports = router;
