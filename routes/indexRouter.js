const { Router } = require("express");
const indexRouter = Router();

indexRouter.get("/", indexController.getIndexPage());

module.exports = indexRouter;
