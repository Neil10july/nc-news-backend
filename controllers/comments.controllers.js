const {
  add_comment_votes,
  remove_comment
} = require("../models/comments.models");

exports.inc_comment_votes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  add_comment_votes(comment_id, inc_votes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

exports.erase_comment = (req, res, next) => {
  const { comment_id } = req.params;

  remove_comment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      next(err);
    });
};
