const topics_router = require("express").Router();
const { send_topics } = require("../controllers/topics.controllers");
const { send405 } = require("../errors/error.handlers");

topics_router
  .route("/")
  .get(send_topics)
  .all(send405);

module.exports = topics_router;
