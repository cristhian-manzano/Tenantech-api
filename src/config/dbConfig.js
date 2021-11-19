require("dotenv").config();

const {
  DEV_DATABASE_HOST,
  DEV_DATABASE_USERNAME,
  DEV_DATABASE_PASSWORD,
  DEV_DATABASE_NAME,
  DEV_DATABASE_DIALECT,
} = process.env;


module.exports = {
  development: {
    username: DEV_DATABASE_USERNAME,
    password: DEV_DATABASE_PASSWORD,
    database: DEV_DATABASE_NAME,
    host: DEV_DATABASE_HOST,
    dialect: DEV_DATABASE_DIALECT,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
