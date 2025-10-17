const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand Must be uniqe"],
      minlength: [3, "Too Short name of Brand"],
      maxlength: [30, "Too Long name of Brand"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    image: String,
    imgId: String,
    createdBy: { name: String, role: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
