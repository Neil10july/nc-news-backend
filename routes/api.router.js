const api_router = require("express").Router();
const topics_router = require("./topics.router");
const users_router = require("./users.router");
const articles_router = require("./articles.router");
const comments_router = require("./comments.router");
const loginRouter = require("./login.router");
const endpoints = require("../endpoints.json");
const { send405 } = require("../errors/error.handlers");

api_router.use("/login", loginRouter);
api_router.use("/topics", topics_router);
api_router.use("/users", users_router);
api_router.use("/articles", articles_router);
api_router.use("/comments", comments_router);
api_router
  .route("/")
  .get((req, res, next) => {
    res.status(200).send(endpoints);
  })
  .all(send405);

module.exports = api_router;
