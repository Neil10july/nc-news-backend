const db = require("../db/connection");

exports.selectUser = username => {
  if (username) {
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
  } else {
    return db.select("*").from("users");
  }
};
