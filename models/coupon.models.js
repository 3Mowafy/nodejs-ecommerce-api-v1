const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon Name is required"],
      unique: [true, "Coupon Name must be unique"],
      uppercase: true,
    },
    expire: {
      type: Date,
      required: [true, "Expire Date is required for this coupon"],
    },
    discount: {
      type: Number,
      required: [true, "Discount Amount is required for this coupon"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
