const express = require("express");
const app = express();
const api_router = require("./routes/api.router");
const {} = require("./errors/error.handlers");

app.use(express.json());
app.use("/api", api_router);

module.exports = app;
