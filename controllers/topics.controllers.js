const { select_topics } = require("../models/topics.models");

exports.send_topics = (req, res, next) => {
  select_topics()
    .then(topics_data => {
      res.status(200).send({ topics: topics_data });
    })
    .catch(err => {
      next(err);
    });
};
