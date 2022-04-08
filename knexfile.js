const ENV = process.env.NODE_ENV || "development";
const { DB_URL } = process.env


const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  production: {
    connection: 'postgres://neil:pass@localhost:5432/nc_news'
  },
  development: {
    connection: {
      database: "nc_news",
      username: "neil",
      password: "pass"
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      username: "neil",
      password: "pass"
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
