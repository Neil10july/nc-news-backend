const { selectUser } = require("../models/users.models");

exports.sendUser = (req, res, next) => {
  const { username } = req.params;
  selectUser(username)
    .then(user_data => {
      res.status(200).send({ user: user_data });
    })
    .catch(err => {
      next(err);
    });
};
