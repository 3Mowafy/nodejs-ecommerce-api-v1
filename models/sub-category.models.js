const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory Must be unique"],
      required: [true, "SubCategory name is required"],
      minlength: [2, "Too Short name of SubCategory"],
      maxlength: [30, "Too Long name of SubCategory"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory Must Be Part of Category"],
    },
    createdBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
