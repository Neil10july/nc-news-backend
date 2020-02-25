const express = require("express");
const app = express();
const cors = require("cors");
const api_router = require("./routes/api.router");
const {
  send404,
  send500,
  customErrorHandler,
  psqlErrorHandler
} = require("./errors/error.handlers");

app.use(cors());
app.use(express.json());
app.use("/api", api_router);
app.use("/*", send404);
app.use(customErrorHandler);
app.use(psqlErrorHandler);
app.use(send500);

module.exports = app;
