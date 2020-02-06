const db = require("../db/connection");
const { check_article, check_order, check_all } = require("./models.utils");

exports.select_articles = queries => {
  const { sort_by, order, author, topic } = queries;
  const checked = check_all(order, author, topic);

  return Promise.all([checked]).then(([all_checked]) => {
    if (all_checked) {
      return db
        .select(
          "articles.author",
          "articles.title",
          "articles.article_id",
          "articles.topic",
          "articles.created_at",
          "articles.votes"
        )
        .from("articles")
        .leftJoin("comments", "comments.article_id", "articles.article_id")
        .count({ comment_count: "comment_id" })
        .groupBy("articles.article_id")
        .orderBy(sort_by || "created_at", order || "desc")
        .modify(query => {
          if (author && topic)
            query.where({ "articles.author": author, "articles.topic": topic });
          else if (author) query.where({ "articles.author": author });
          else if (topic) query.where({ "articles.topic": topic });
        });
    } else
      return Promise.reject({ status: 400, msg: "Please check your queries" });
  });
};

exports.select_article = article_id => {
  const check = check_article(article_id);
  return Promise.all([check]).then(([checked]) => {
    if (checked) {
      return db
        .select("articles.*")
        .from("articles")
        .leftJoin("comments", "comments.article_id", "articles.article_id")
        .count({ comment_count: "comment_id" })
        .groupBy("articles.article_id")
        .modify(query => {
          query.where({ "articles.article_id": article_id }).first();
        });
    } else {
      return Promise.reject({ status: 400, msg: "Please check your queries" });
    }
  });
};

exports.inc_article_votes = (article_id, inc_by) => {
  const check = check_article(article_id);
  if (!inc_by) {
    return Promise.reject({
      status: 400,
      msg: "Body must be in correct format (Ex. { inc_vote: 5 })"
    });
  }
  return Promise.all([check]).then(([checked]) => {
    if (checked) {
      return db("articles")
        .where("article_id", "=", article_id)
        .increment("votes", inc_by)
        .returning("*")
        .then(data => {
          return data;
        });
    } else {
      return Promise.reject({ status: 400, msg: "Please check your queries" });
    }
  });
};

exports.join_comment = (article_id, author, body) => {
  const check = check_article(article_id);
  return Promise.all([check]).then(([article_check]) => {
    if (article_check) {
      return db("comments")
        .insert({ article_id, author, body })
        .returning("*")
        .then(comment => {
          return comment;
        });
    } else {
      return Promise.reject({ status: 400, msg: "Please check your queries" });
    }
  });
};

exports.select_comments = (article_id, sort_by, order) => {
  const article_check = check_article(article_id);
  const order_check = check_order(order);

  return Promise.all([article_check, order_check]).then(
    ([checked_article, checked_order]) => {
      if (checked_article && checked_order) {
        return db
          .select(
            "comments.comment_id",
            "comments.votes",
            "comments.created_at",
            "comments.author",
            "comments.body"
          )
          .from("comments")
          .orderBy(sort_by || "created_at", order || "desc")
          .modify(query => {
            if (article_id) query.where({ "comments.article_id": article_id });
          });
      } else {
        return Promise.reject({
          status: 400,
          msg: "Please check your queries"
        });
      }
    }
  );
};
