var express = require("express");
var router = express.Router();
var User = require("../../model/user");

var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password == null) {
    return res.status(400).json({ error: "Missing email or passward!" });
  }

  const EmailCheck = await User.findOne({ email }).exec();
  if (EmailCheck) {
    return res.status(400).json({ error: "Email already registered!" });
  }

  const newUser = new User({
    email,
    password: bcrypt.hashSync(password, 8),
  });

  const saveUser = await newUser.save();

  const token = jwt.sign({ id: saveUser._id }, process.env.JWT_SECRET_KEY);

  res
    .status(200)
    .json({ msg: "New user registered with success!", token: token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or passward!" });
  }

  const UserCheck = await User.findOne({ email }).exec();
  if (!UserCheck) {
    return res.status(400).json({ error: "User do not exists!" });
  }

  if (!bcrypt.compareSync(password, UserCheck.password)) {
    return res.status(400).json({ error: "Wrong password!" });
  }

  const token = jwt.sign({ id: UserCheck._id }, process.env.JWT_SECRET_KEY);

  res.status(200).json({ name: UserCheck.name, token });
});

module.exports = router;
