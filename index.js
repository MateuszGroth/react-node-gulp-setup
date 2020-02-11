require("dotenv").config();
//process.env.NAME
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", function(req, res) {
  res.render("index.ejs");
});

app.listen(port, () => {
  console.log("LISTENING ON PORT" + port);
});
