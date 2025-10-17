const ApiError = require("../helpers/apiError.helpers");

const globalErrors = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  if (process.env.NODE_ENV === "development") {
    errorForDevMode(err, res);
  } else {
    if (err.name === "JsonWebTokenError")
      err = new ApiError("invalid Login, Please Try Login Again ", 401);

    if (err.name === "TokenExpiredError")
      err = new ApiError("Token Expired, Please Try Login Again", 401);

    errorForProdMode(err, res);
  }
};

const errorForDevMode = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    Error: err,
    message: err.message,
    stack: err.stack,
  });
};

const errorForProdMode = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalErrors;
