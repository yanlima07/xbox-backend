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
  if (!name) {
    return res.status(400).json("Nome inválido");
  }

  const Pokemon = await Pokemon.find({
    name: { $regex: name, $options: "i" },
  }).exec();

  if (!Pokemon) {
    return res.status(400).json("Pokémon not found!");
  }

  res.status(200).json(Pokemon);
});

router.post("/", checkUserToken, upload.single("url"), (req, res) => {
  fetch(`${process.env.FILESTACK_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "image/png" },
    body: req.file.buffer,
  })
    .then((dataResponse) => dataResponse.json())
    .then(
      async (responseFileStack) => {
        const newPokemon = new Pokemon({
          name: req.body.name,
          url: responseFileStack.url,
        });
        newPokemon.save();

        return res.status(200).json("Pokémon created with sucess!");
      },
      (error) => {
        return res.status(500).json("Pokémon not created!");
      }
    );
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
