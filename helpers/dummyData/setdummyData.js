const fs = require("fs");
const productModel = require("../../models/product.models");

require("dotenv").config({ path: "../../.env" });
require("../../config/database.config")();

const readProducts = JSON.parse(fs.readFileSync("./products.json"));

const insertData = async () => {
  try {
    await productModel.create(readProducts);
    console.log("Products has been created successfully");
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

const deleteData = async () => {
  try {
    await productModel.deleteMany();
    console.log("Products has been deleted successfully");
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

if (process.argv[2] == "-i") {
  insertData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
