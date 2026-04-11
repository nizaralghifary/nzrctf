require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.listen(process.env.PORT_A, () => {
  console.log(`Stage 1 running on http://localhost:${process.env.PORT_A}`);
});