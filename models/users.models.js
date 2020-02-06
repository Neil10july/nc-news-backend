const db = require("../db/connection");
const { check_username } = require("./models.utils");

exports.selectUser = username => {
  const check = check_username(username);
  if (username) {
    return Promise.all([check]).then(([checked]) => {
      if (checked) {
        return db("users")
          .where("username", username)
          .returning("*")
          .then(user_data => {
            if (user_data[0]) {
              return user_data;
            } else {
              return Promise.reject({
                status: 400,
                msg: "Invalid username"
              });
            }
          });
      }
    });
  } else return db.select("*").from("users");
};
