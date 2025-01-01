const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");

indexRouter.get("/", indexController.getIndexPage);
indexRouter.get("/signUp", indexController.getSignUpPage);
indexRouter.post("/signUp", indexController.postSignUp);
indexRouter.get("/logIn", indexController.getLogIn);
indexRouter.post("/logIn", indexController.postLogIn);
indexRouter.get("/logOut", indexController.getLogout);
indexRouter.get("/files", indexController.getAddFiles);
indexRouter.get("/folder", indexController.getFolder);
indexRouter.post("/folder", indexController.postFolder);
indexRouter.get("/insideFolder", indexController.getFolderContents);
indexRouter.get("/updateFolder", indexController.getUpdateFolder);
indexRouter.post("/updateFolder", indexController.postUpdateFolder);
indexRouter.post("/deleteFolder", indexController.postDeleteFolder);

module.exports = indexRouter;
