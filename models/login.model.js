const db = require("../db/connection");
const { check_username } = require("./models.utils");

exports.checkUserCreds = (username, password) => {
  const checkUser = check_username(username);

  return Promise.all([checkUser]).then(([user_checked]) => {
    if (user_checked) {
      return db
        .select("users.password")
        .from("users")
        .where({ username })
        .returning("*")
        .then(res => {
          const pass = res[0].password;
          if (pass === password) {
            return true;
          } else
            return Promise.reject({ status: 401, msg: "Invalid password" });
        });
    }
  });
};
