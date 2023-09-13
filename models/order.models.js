const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Order must belong to user"],
    },
    cartItems: [
      {
        product: { type: mongoose.Schema.ObjectId, ref: "Product" },
        color: String,
        price: Number,
        quantity: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingAdress: {
      details: String,
      city: String,
      postalCode: String,
      phone: String,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: Number,
    PaymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  {
    timestamps: true,
  }
);

orderSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "user",
      select: "name profileImg phone",
    },
    {
      path: "cartItems.product",
      select: "title imageCover price",
    },
  ]);
  next();
});

module.exports = mongoose.model("Order", orderSchema);
