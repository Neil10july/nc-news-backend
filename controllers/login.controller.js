const { checkUserCreds } = require("../models/login.model");

exports.validateUserCreds = (req, res, next) => {
  const { username, password } = req.body;

  checkUserCreds(username, password)
    .then(result => {
      res.status(200).send({ match: result });
    })
    .catch(err => {
      next(err);
    });
};
