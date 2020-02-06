const db = require("../db/connection");
const { check_comment } = require("./models.utils");

exports.add_comment_votes = (comment_id, inc_by = 0) => {
  const check = check_comment(comment_id);

  if (!inc_by) {
    return Promise.reject({
      status: 400,
      msg: "Body must be in correct format (Ex. { inc_vote: 5 })"
    });
  }
  return Promise.all([check]).then(([comment_checked]) => {
    if (comment_checked) {
      return db("comments")
        .where({ comment_id })
        .increment("votes", inc_by)
        .returning("*")
        .then(comment => {
          return comment[0];
        });
    } else {
      return Promise.reject({ status: 400, msg: "Please check your queries" });
    }
  });
};

exports.remove_comment = comment_id => {
  const check = check_comment(comment_id);

  return Promise.all([check]).then(([comment_checked]) => {
    if (comment_checked) {
      return db("comments")
        .where({ comment_id })
        .del()
        .then(() => {
          return "comment deleted";
        });
    } else {
      return Promise.reject({ status: 400, msg: "Please check your URL" });
    }
  });
};
