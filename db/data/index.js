const ENV = process.env.NODE_ENV || "development";
const dev_data = require("./development-data/index");
const test_data = require("./test-data/index");
const data = { development: dev_data, test: test_data };

module.exports = data[ENV];
