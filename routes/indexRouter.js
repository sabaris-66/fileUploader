const { Router } = require("express");
const indexRouter = Router();

indexRouter.get("/", indexController.getIndexPage());
indexRouter.get("/signUp", indexController.getSignUpPage());
indexRouter.post("/signUp", indexController.postSignUp());

module.exports = indexRouter;
