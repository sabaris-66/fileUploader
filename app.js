const bcrypt = require("bcryptjs");
require("dotenv").config();
const express = require("express");
const path = require("node:path");
const port = process.env.PORT || 3000;
// pool later
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// router later
// db queries not required

// app express
const app = express();

// for styles css
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// for html views
app.use("views", path.join(__dirname, "views"));
app.use("view engine", "ejs");

// for req.body parameters
app.use(express.urlencoded({ extended: true }));

// router use
app.use("/", indexRouter);

app.listen(port, () => console.log(`Started listening on port ${port}`));
