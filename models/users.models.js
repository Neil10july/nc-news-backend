const db = require("../db/connection");
const { check_username, testUserCred } = require("./models.utils");

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
  } else
    return db
      .select("users.username", "users.avatar_url", "users.name")
      .from("users");
};

exports.addUser = (username, password, name) => {
  const testCreds = testUserCred(username, password, name);

  return Promise.all([testCreds]).then(([creds_tested]) => {
    if (creds_tested) {
      return db("users")
        .insert({ username, password, name })
        .returning("*")
        .then(res => {
          return { user: res[0], msg: "user created!" };
        });
    }
  });
};
