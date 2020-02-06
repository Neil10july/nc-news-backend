const db = require("../db/connection");

exports.select_topics = () => {
  return db.select("*").from("topics");
};
