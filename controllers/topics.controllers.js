const { select_topics } = require("../models/topics.models");

exports.send_topics = (req, res, next) => {
  select_topics();
};
