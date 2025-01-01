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
    .withMessage("Name less than 40 characters and greater than 5 characters"),
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

const validateFolder = [
  body("folderName")
    .trim()
    .isString()
    .withMessage("Only Alphabetic Characters")
    .isLength({ min: 1, max: 30 })
    .custom(async (value) => {
      const existingFolder = await prismaClientQueries.findByFolderName(value);
      if (existingFolder) {
        throw new Error("A folder with this name already exists");
      }
    }),
];

const validateUpdatedFolder = [
  body("updatedName")
    .trim()
    .isString()
    .withMessage("Only Alphabetic Characters")
    .isLength({ min: 1, max: 30 })
    .custom(async (value) => {
      const existingFolder = await prismaClientQueries.findByFolderName(value);
      if (existingFolder) {
        throw new Error("A folder with this name already exists");
      }
    }),
];

exports.getIndexPage = async (req, res) => {
  const folders = await prismaClientQueries.getFolders();
  const files = await prismaClientQueries.getFiles();
  console.log(files);
  res.render("index", { user: req.user, folders, files });
};

exports.getSignUpPage = (req, res) => {
  res.render("signUp");
};

exports.postSignUp = [
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
    res.redirect("/");
  },
];

exports.getLogIn = (req, res) => {
  res.render("logIn");
};

exports.postLogIn = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/logIn",
});

exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.getAddFiles = (req, res) => {
  res.render("addFile", { folderName: req.query.folderName });
};

exports.getFolder = (req, res) => {
  res.render("createFolder");
};

exports.postFolder = [
  validateFolder,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createFolder", { errors: errors.array() });
    }
    await prismaClientQueries.createFolder(req.body.folderName);
    res.redirect("/");
  },
];

exports.getFolderContents = async (req, res) => {
  const folderContents = await prismaClientQueries.getFiles(
    req.query.folderName
  );
  res.render("folderContent", {
    folderContents,
    folderName: req.query.folderName,
  });
};

exports.getUpdateFolder = (req, res) => {
  console.log("blah", req.query.folderName);
  res.render("updateFolder", { folderName: req.query.folderName });
};

exports.postUpdateFolder = [
  validateUpdatedFolder,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateFolder", { errors: errors.array() });
    }
    await prismaClientQueries.updateFolder(
      req.query.folderName,
      req.body.updatedName
    );
    res.redirect("/");
  },
];

exports.postDeleteFolder = async (req, res) => {
  await prismaClientQueries.deleteFolder(req.query.folderName);
  res.redirect("/");
};
