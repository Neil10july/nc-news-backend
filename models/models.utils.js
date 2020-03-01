const db = require("../db/connection");

const check_article = article_id => {
  return db("articles")
    .select("*")
    .where({ article_id })
    .then(data => {
      if (data.length !== 0) {
        return true;
      } else {
        return Promise.reject({ status: 404, msg: "Invalid article_id" });
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
        return Promise.reject({ status: 404, msg: "Invalid comment_id" });
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
          return Promise.reject({ status: 404, msg: "Invalid author query" });
        }
      });
  } else return true;
};

const check_username = username => {
  if (username) {
    return db("users")
      .select("*")
      .where({ username })
      .then(data => {
        if (data.length !== 0) {
          return true;
        } else {
          return Promise.reject({ status: 404, msg: "Invalid username" });
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
          return Promise.reject({ status: 404, msg: "Invalid topic query" });
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

const check_comment_body = (author, body) => {
  if (author === undefined || body === undefined) {
    return Promise.reject({
      status: 400,
      msg:
        "Body must be in correct format (Ex. { username: 'username', body: 'comment' })"
    });
  } else return true;
};

const testUserCred = (username, password, name) => {
  const regex = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
  const testUser = regex.test(username);
  const testPass = regex.test(password);
  const testName = /^[A-Za-z]+$/.test(name);

  if (!testUser) {
    return Promise.reject({
      status: 400,
      msg: "username must only contain alphanumeric characters"
    });
  } else if (!testPass) {
    return Promise.reject({
      status: 400,
      msg: "password must only contain alphanumeric characters"
    });
  } else if (!testName) {
    return Promise.reject({
      status: 400,
      msg: "name must only contain only A-Z characters"
    });
  } else return true;
};

module.exports = {
  check_article,
  check_order,
  check_author,
  check_username,
  check_topic,
  check_comment,
  check_comment_body,
  check_all,
  testUserCred
};
