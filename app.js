const bcrypt = require("bcryptjs");
require("dotenv").config();
const express = require("express");
const path = require("node:path");
const port = process.env.PORT || 3000;
// pool later
const expressSession = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// using prisma session store instead of default one
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
// router later
const indexRouter = require("./routes/indexRouter");
// db queries not required
// using prisma queries instead
const prismaClientQueries = require("./prisma/prismaClient");

// app express
const app = express();

// for styles css
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// for html views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// for req.body parameters
app.use(express.urlencoded({ extended: true }));

// express prisma session store
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at isro",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// passport session
app.use(passport.session());

// passport local strategy usage
passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log(username, password);
    try {
      const user = await prismaClientQueries.findByUsername(username);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  try {
    const user = await prismaClientQueries.findByUsername(username);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// router use
app.use("/", indexRouter);

// error response
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err);
});

app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
});
