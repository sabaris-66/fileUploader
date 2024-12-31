const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");

indexRouter.get("/", indexController.getIndexPage);
indexRouter.get("/signUp", indexController.getSignUpPage);
indexRouter.post("/signUp", indexController.postSignUp);
indexRouter.get("/logIn", indexController.getLogIn);
indexRouter.post("/logIn", indexController.postLogIn);
indexRouter.get("/logOut", indexController.getLogout);

module.exports = indexRouter;
