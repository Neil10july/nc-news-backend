const articles_router = require("express").Router();
const {
  send_articles,
  send_article,
  send_comments,
  add_votes,
  add_comment,
  erase_article
} = require("../controllers/articles.controllers");
const { send405 } = require("../errors/error.handlers");

articles_router
  .route("/")
  .get(send_articles)
  .all(send405);

articles_router
  .route("/:article_id")
  .get(send_article)
  .patch(add_votes)
  .delete(erase_article)
  .all(send405);

articles_router
  .route("/:article_id/comments")
  .post(add_comment)
  .get(send_comments)
  .all(send405);

module.exports = articles_router;
