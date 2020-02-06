const comments_router = require("express").Router();
const {
  inc_comment_votes,
  erase_comment
} = require("../controllers/comments.controllers");
const { send405 } = require("../errors/error.handlers");

comments_router
  .route("/:comment_id")
  .patch(inc_comment_votes)
  .delete(erase_comment)
  .all(send405);

module.exports = comments_router;
