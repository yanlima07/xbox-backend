var express = require("express");
var router = express.Router();
const Pokemon = require("../../model/pokemon");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const fetch = require("node-fetch");

var jwt = require("jsonwebtoken");

router.get("/", checkUserToken, async (req, res) => {
  const name = req.query.name;
  const pokemon = await Pokemon.find({
    name: { $regex: name, $options: "i" },
  }).exec();
  res.status(200).json(pokemon);
});

function checkUserToken(req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(400).json({ error: "User not athenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, function (error, decoded) {
    if (error) return res.status(400).json({ error: "User not athenticated!" });

    req.token = token;
    req.idUser = decoded.id;
    next();
  });
}

module.exports = router;
