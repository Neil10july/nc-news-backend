const loginRouter = require("express").Router();
const { validateUserCreds } = require("../controllers/login.controller");
const { send405 } = require("../errors/error.handlers");

loginRouter.route("/").post(validateUserCreds);

module.exports = loginRouter;
