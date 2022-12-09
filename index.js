const express = require("express");
const server = express();

const dotenv = require("dotenv");
const cors = require("cors");
//const router = require("./controller/router");

dotenv.config();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

server.use(cors(corsOptions));

server.use(express.json());

//server.use("/", router);

const mongoose = require("mongoose");
const mongoDB = `mongodb+srv://admin:${process.env.PASSWORD}@cluster0.9imxnfv.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const port = process.env.PORT || 5500;
server
  .listen(port, () => {
    console.log("Server ON on " + `Port: ${port}`);
  })
  .on("error", (err) => {
    console.log(err);
  });
