const {
  topics_data,
  articles_data,
  comments_data,
  users_data
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  const topicsInsertions = knex("topics").insert(topics_data);
  const usersInsertions = knex("users").insert(users_data);

  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const formatted_articles = formatDates(articles_data);
      return knex("articles")
        .insert(formatted_articles)
        .returning("*");
    })
    .then(article_rows => {
      const articles_ref = makeRefObj(article_rows);
      const formatted_comments = formatComments(comments_data, articles_ref);
      return knex("comments").insert(formatted_comments);
    });
};
