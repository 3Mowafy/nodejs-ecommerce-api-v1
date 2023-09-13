const mongoose = require("mongoose");

const dbConnection = async () => {
  await mongoose.connect(process.env.DB_URI);
  console.log(`Databse Connected: ${mongoose.connection.host}`);
};

module.exports = dbConnection;
