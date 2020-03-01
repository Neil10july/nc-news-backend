const { selectUser, addUser } = require("../models/users.models");

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

exports.newUser = (req, res, next) => {
  const { username, password, name } = req.body;

  addUser(username, password, name)
    .then(({ user, msg }) => {
      res.status(201).send({ user, msg });
    })
    .catch(err => {
      next(err);
    });
};
