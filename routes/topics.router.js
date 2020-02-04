const topics_router = require("express").Router();
const { send_topics } = require("../controllers/topics.controllers");

topics_router.route("/").get(send_topics);

module.exports = topics_router;
