const db = require("../db/connection");
const { check_username } = require("./models.utils");

exports.selectUser = username => {
  const check = check_username(username);
  if (username) {
    return Promise.all([check]).then(([checked]) => {
      if (checked === true) {
        return db("users")
          .where("username", username)
          .returning("*")
          .then(user => {
            return user[0];
          });
      }
    });
  } else return db.select("*").from("users");
};
