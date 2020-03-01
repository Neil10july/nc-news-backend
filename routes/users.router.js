const users_router = require("express").Router();
const { sendUser, newUser } = require("../controllers/users.controllers");
const { send405 } = require("../errors/error.handlers");

users_router
  .route("/")
  .get(sendUser)
  .post(newUser)
  .all(send405);

users_router
  .route("/:username")
  .get(sendUser)
  .all(send405);

module.exports = users_router;
