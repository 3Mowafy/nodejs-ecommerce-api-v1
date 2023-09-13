const express = require("express");
const morgan = require("morgan");
const path = require("path");

require("dotenv").config();
const { webhookHandler } = require("../controllers/order.controllers");
const routesHandler = require("./routes");
const security = require("./security");

// Connect Database
require("../config/database.config")();

// express app
const app = express();

// Stripe Hook
app.post("/webhook", express.raw({ type: "application/json" }), webhookHandler);

// Request Details
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
console.log(`Mode: ${process.env.NODE_ENV}`);

app.use(express.static(path.join(__dirname, "../static")));
security(app);
routesHandler(app);

module.exports = app;
