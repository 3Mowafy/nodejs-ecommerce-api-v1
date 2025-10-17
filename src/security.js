const express = require("express");
const cors = require("cors");
const compression = require("compression");
const rateLimiter = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const appSecurity = (app) => {
  app.use(cookieParser());

  // Convert data To JSON
  app.use(
    express.json({
      limit: "20kb",
    })
  );

  //Data Sanitization
  app.use(mongoSanitize());
  app.use(xss());

  // Helmet helps secure Express apps by setting HTTP response headers.
  app.use(helmet());

  // Corss Origin and compression Responses
  app.use(
    cors({
      origin: [
      "http://localhost:4200",
      "https://so-shop.netlify.app",
    ],
      credentials: true,
    })
  );
  // app.options("*", cors());
  app.use(compression());

  // Limit each IP to 200 requests per `window` for 10 minutes
  // const apiLimiter = rateLimiter({
  //   windowMs: 10 * 60 * 1000, // 10 minutes
  //   max: 200,
  //   message:
  //     "Too many Requests from this IP, please try again after 10 minutes",
  // });

  // Limit each IP to 5 Forgot Password requests per `window` for 10 minutes
  // const forgotPassLimiter = rateLimiter({
  //   windowMs: 10 * 60 * 1000, // 10 minutes
  //   max: 5,
  //   message:
  //     "Too many Requests from this IP, please try again after 10 minutes",
  // });

  // app.use("/api", apiLimiter);
  // app.use("/api/v1/auth/forgotPassword/email", forgotPassLimiter);
  // app.use("/api/v1/auth/forgotPassword/phone", forgotPassLimiter);
  // app.use("/api/v1/auth/login", forgotPassLimiter);

  app.use(
    hpp({
      whitelist: [
        "quantity",
        "sold",
        "price",
        "ratingsAverage",
        "ratingsQuantity",
      ],
    })
  );
};

module.exports = appSecurity;
