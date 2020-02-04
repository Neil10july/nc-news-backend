const knex = require("knex");
const customConfig = require("../knexfile");
const db = knex(customConfig);

module.exports = db;
