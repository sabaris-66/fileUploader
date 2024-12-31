const bcrypt = require("bcryptjs");
require("dotenv").config();
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const prismaClientQueries = require("../prisma/prismaClient");

const validateUser = [
  body("fullName")
    .trim()
    .isAlpha()
    .withMessage("Only alphabetic characters")
    .isLength({ min: 5, max: 40 })
    .withMessage("Name less than 40 characters"),
  body("username")
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address")
    .custom(async (value) => {
      const existingUser = await prismaClientQueries.findByUsername(value);
      if (existingUser && existingUser.username == value) {
        throw new Error("A user already exists with this username");
      }
    }),
  body("password")
    .trim()
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Not a strong password"),
  body("confirmPassword").custom((value, { req }) => {
    if (value === req.body.password) {
      return true;
    }
    throw new Error("Password and confirm password must be same");
  }),
];

exports.getIndexPage = (req, res) => {
  res.render("index");
};

exports.getSignUpPage = (req, res) => {
  res.render("signUp");
};

exports.postSignUp = (req, res) => [
  // lot of things to do
  // express-validator
  // prisma instead of direct postgresql db

  // begin validation
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signUp", {
        errors: errors.array(),
      });
    }

    // if validation passes
    const { fullName, username, password } = req.body;

    // hash password
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        throw new Error(err);
      } else {
        await prismaClientQueries.pushMember(
          username,
          fullName,
          hashedPassword
        );
      }
    });

    // after uploading username and hashed password to our db through prisma, render back to index page
    res.render("index");
  },
];
