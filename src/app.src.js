const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const compression = require("compression");
const rateLimiter = require("express-rate-limit");

require("dotenv").config();
const { webhookHandler } = require("../controllers/order.controllers");
const routesHandler = require("./routes.src");

// Connect Database
require("../config/database.config")();

// express app
const app = express();

// Corss Origin and compression Responses
app.use(cors());
app.options("*", cors());
app.use(compression());

// Stripe Hook
app.post("/webhook", express.raw({ type: "application/json" }), webhookHandler);

// Limit each IP to 200 requests per `window` for 10 minutes
const apiLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200,
  message: "Too many Requests from this IP, please try again after 10 minutes",
});

// Limit each IP to 5 Forgot Password requests per `window` for 10 minutes
const forgotPassLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: "Too many Requests from this IP, please try again after 10 minutes",
});

app.use("/api", apiLimiter);
app.use("/api/v1/auth/forgotPassword/email", forgotPassLimiter);
app.use("/api/v1/auth/forgotPassword/phone", forgotPassLimiter);

// Middlewares
app.use(
  express.json({
    limit: "20kb",
  })
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
console.log(`Mode: ${process.env.NODE_ENV}`);

app.use(express.static(path.join(__dirname, "../static")));

routesHandler(app);

module.exports = app;
