const app = require("./src/app");
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>
  console.log(`Open Your Host ${process.env.BASE_URL}api/v1/`)
);

//  ----------  Error handling Middlewares ----------
const globalErrors = require("./middlewares/error.middlewares");
const ApiError = require("./helpers/apiError.helpers");

// Routes Error handler
app.all("*", (req, res, next) => {
  res.redirect(process.env.BASE_URL);
});

// Global Error handling Middleware inside Express
app.use(globalErrors);

// handle Rejection Error Outside Express
process.on("unhandledRejection", (err) => {
  console.log(
    `UnhandledRejection Error: ${err.name} | Message: ${err.message}`
  );
  server.close(() => {
    console.log("Server Shutting Down................");
    process.exit(1);
  });
});
