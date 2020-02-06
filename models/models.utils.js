const db = require("../db/connection");

const check_article = article_id => {
  return db("articles")
    .select("*")
    .where({ article_id })
    .then(data => {
      if (data.length !== 0) {
        return true;
      } else {
        return Promise.reject({ status: 400, msg: "Invalid article_id" });
      }
    });
};

const check_comment = comment_id => {
  return db("comments")
    .select("*")
    .where({ comment_id })
    .then(data => {
      if (data.length !== 0) {
        return true;
      } else {
        return Promise.reject({ status: 400, msg: "Invalid comment_id" });
      }
    });
};

const check_author = author => {
  if (author) {
    return db("users")
      .select("*")
      .where({ username: author })
      .then(data => {
        if (data.length !== 0) {
          return true;
        } else {
          return Promise.reject({ status: 400, msg: "Invalid author query" });
        }
      });
  } else return true;
};

const check_topic = topic => {
  if (topic) {
    return db("topics")
      .select("*")
      .where({ slug: topic })
      .then(data => {
        if (data.length !== 0) {
          return true;
        } else {
          return Promise.reject({ status: 400, msg: "Invalid topic query" });
        }
      });
  } else return true;
};

const check_order = order => {
  if (order) {
    if (order !== "asc" && order !== "desc") {
      return Promise.reject({ status: 400, msg: "Invalid order query" });
    } else return true;
  } else return true;
};

const check_all = (this_order, this_author, this_topic) => {
  return Promise.all([
    check_order(this_order),
    check_author(this_author),
    check_topic(this_topic)
  ]).then(([order_check, auth_check, topic_check]) => {
    if (order_check === true && auth_check === true && topic_check === true) {
      return true;
    }
  });
};

module.exports = {
  check_article,
  check_order,
  check_author,
  check_topic,
  check_comment,
  check_all
};
