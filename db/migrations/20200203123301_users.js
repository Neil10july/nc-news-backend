exports.up = function(knex) {
  return knex.schema.createTable("users", usersTable => {
    usersTable
      .string("username", 40)
      .primary()
      .notNullable();
    usersTable.string("password").defaultTo("pass");
    usersTable
      .string("avatar_url")
      .defaultTo(
        "https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg"
      );
    usersTable.string("name").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
