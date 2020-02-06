const {
  select_articles,
  select_article,
  select_comments,
  inc_article_votes,
  join_comment
} = require("../models/articles.models");

exports.send_articles = (req, res, next) => {
  const queries = req.query;
  select_articles(queries)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(err => {
      next(err);
    });
};

exports.send_article = (req, res, next) => {
  const { article_id } = req.params;
  select_article(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

exports.add_votes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  inc_article_votes(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

exports.add_comment = (req, res, next) => {
  const { article_id } = req.params;
  const { username } = req.body;
  let { body } = req.body;
  if (body.length < 1) {
    body = null;
  }
  join_comment(article_id, username, body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

exports.send_comments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  select_comments(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => {
      next(err);
    });
};
