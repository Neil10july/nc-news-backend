exports.send404 = (req, res, next) => {
  res.status(404).send({ msg: "Invalid URL" });
};

exports.send405 = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psqlErrorHandler = (err, req, res, next) => {
  const error = err.code;
  const psql_codes = {
    "22P02": { status: 400, msg: `Invalid syntax type` },
    23503: { status: 422, msg: "Foreign key violation" },
    23502: { status: 400, msg: "Body contains null value" },
    42703: { status: 400, msg: "Undefined column in query" }
  };
  if (error) {
    const { status } = psql_codes[error];
    const { msg } = psql_codes[error];
    res.status(status).send({ msg });
  } else {
    next();
  }
};

exports.send500 = (req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
