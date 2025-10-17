const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Product title is Required"],
      minlength: [5, "Too short title of Product"],
      maxlength: [100, "Too long title of Product"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is Required"],
      minlength: [20, "Too Short description of Product"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is Required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is Required"],
      max: [50000, "Too Long Price of Product"],
    },
    priceAfterDiscount: Number,
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image Cover is Required"],
    },
    imgCoverId: String,
    images: [{ id: String, image: String }],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be follow Category"],
    },
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "rating should be greater than or equal 1.0"],
      max: [5, "rating should be less than or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    createdBy: { name: String, role: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "category", select: "name -_id" },
    { path: "subCategory", select: "name -_id" },
  ]);

  next();
});

module.exports = mongoose.model("Product", productSchema);
