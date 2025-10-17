const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category Must be uniqe"],
      minlength: [3, "Too Short Name of Category"],
      maxlength: [30, "Too Long Name of Category"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    image: String,
    imgId: String,
    createdBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
