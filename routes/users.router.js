const users_router = require("express").Router();
const { sendUser } = require("../controllers/users.controllers");
const { send405 } = require("../errors/error.handlers");

users_router
  .route("/")
  .get(sendUser)
  .all(send405);

users_router
  .route("/:username")
  .get(sendUser)
  .all(send405);

module.exports = users_router;
