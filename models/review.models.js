const mongoose = require("mongoose");
const productModel = require("./product.models");

const reviewSchema = mongoose.Schema(
  {
    title: { type: String, trim: true },
    ratings: {
      type: Number,
      min: [1, "rating should be greater than or equal 1.0"],
      max: [5, "rating should be less than or equal 5.0"],
      required: [true, "rating Must be Added"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review Must belong to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review Must belong to Product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.avgSumRatings = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "product",
        avg: { $avg: "$ratings" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: parseFloat(result[0].avg).toFixed(2),
      ratingsQuantity: result[0].count,
    });
  } else {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.avgSumRatings(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
