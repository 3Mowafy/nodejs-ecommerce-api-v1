const asyncHandler = require("express-async-handler");
const ApiError = require("../helpers/apiError.helpers");

const cartModel = require("../models/cart.models");
const productModel = require("../models/product.models");
const couponModel = require("../models/coupon.models");

class Cart {
  static #calcTotalPrice = (cartData) => {
    let totalPrice = 0;
    cartData.cartItems.forEach(
      (cartItem) => (totalPrice += cartItem.price * cartItem.quantity)
    );
    cartData.cartTotalPrice = totalPrice;
    cartData.cartAfterDiscount = undefined;
  };

  // @desc        Add Product to Cart
  // @route       POST /api/v1/cart
  // @access      Private/User
  static addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body;

    let cartData = await cartModel.findOne({
      user: req.user._id,
    });

    const productData = await productModel.findById(productId);

    if (productData.quantity < 1)
      return next(new ApiError("Can't Add product Quantity", 400));

    if (productData.colors.length > 0) {
      const colorIndex = productData.colors.findIndex((clr) => clr == color);

      if (colorIndex === -1)
        return next(new ApiError("Color is Not Found in Product Colors", 400));
    }

    if (!productData)
      return next(
        new ApiError("Product not found, please add another product", 404)
      );

    if (!cartData) {
      cartData = await cartModel.create({
        user: req.user._id,
        cartItems: [{ product: productId, color, price: productData.price }],
      });
    } else {
      const productIndex = cartData.cartItems.findIndex(
        (prodIndex) =>
          prodIndex.product.toString() === productId &&
          prodIndex.color === color
      );

      if (cartData.cartItems[productIndex]?.quantity + 1 > productData.quantity)
        return next(new ApiError("Can't increase product Quantity", 400));

      if (productIndex > -1) {
        cartData.cartItems[productIndex].quantity += 1;
      } else {
        cartData.cartItems.push({
          product: productId,
          color,
          price: productData.price,
        });
      }
    }

    this.#calcTotalPrice(cartData);

    await cartData.save();

    res
      .status(201)
      .json({ cartItemsCount: cartData.cartItems.length, data: cartData });
  });

  // @desc        Get User Cart
  // @route       GET /api/v1/cart
  // @access      Private/User
  static getUserCart = asyncHandler(async (req, res, next) => {
    const cartData = await cartModel.findOne({ user: req.user._id });

    if (!cartData) return next(new ApiError("Cart User not found", 404));

    res
      .status(200)
      .json({ cartItemsCount: cartData.cartItems.length, data: cartData });
  });

  // @desc        Remove Specific Product from cart
  // @route       DELETE /api/v1/cart/:idProductInCart
  // @access      Private/User
  static removeSpecificProduct = asyncHandler(async (req, res) => {
    const cartData = await cartModel.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { cartItems: { _id: req.params.idProductInCart } } },
      { new: true }
    );

    this.#calcTotalPrice(cartData);
    await cartData.save();

    res
      .status(200)
      .json({ cartItemsCount: cartData.cartItems.length, data: cartData });
  });

  // @desc        Clear Cart Items
  // @route       DELETE /api/v1/cart
  // @access      Private/User
  static clearItems = asyncHandler(async (req, res) => {
    await cartModel.findOneAndDelete({ user: req.user._id });

    res.status(200).json({ message: "Cart successfully cleared" });
  });

  // @desc        Update Item Quantity
  // @route       PUT /api/v1/cart/:idProductInCart
  // @access      Private/User
  static updateItemQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;
    const cartData = await cartModel.findOne({ user: req.user._id });

    if (!cartData)
      return next(new ApiError("No Cart Items found for this user", 404));

    const itemIndex = cartData.cartItems.findIndex(
      (item) => item._id.toString() === req.params.idProductInCart
    );

    const productData = await productModel.findById(
      cartData.cartItems[itemIndex].product
    );

    if (quantity < 1) return next(new ApiError("Can't Add Quantity", 400));

    if (quantity > productData.quantity)
      return next(
        new ApiError("Quantity Enterd is greater than Product Quantity", 400)
      );

    if (itemIndex > -1) {
      cartData.cartItems[itemIndex].quantity = quantity;
    } else {
      return next(
        new ApiError(
          `Items with id:(${req.params.idProductInCart}) not found`,
          404
        )
      );
    }

    this.#calcTotalPrice(cartData);

    await cartData.save();
    res
      .status(200)
      .json({ cartItemsCount: cartData.cartItems.length, data: cartData });
  });

  // @desc        Apply Coupon
  // @route       PUT /api/v1/cart/applyCoupon
  // @access      Private/User
  static applyCoupon = asyncHandler(async (req, res, next) => {
    const couponData = await couponModel.findOne({
      name: req.body.coupon,
      expire: { $gt: Date.now() },
    });

    if (!couponData)
      return next(new ApiError("Coupon is invalid or expired", 404));

    const cartData = await cartModel.findOne({ user: req.user._id });

    if (!cartData)
      return next(new ApiError("there is no cart to this user", 404));

    cartData.cartAfterDiscount = (
      cartData.cartTotalPrice -
      (cartData.cartTotalPrice * couponData.discount) / 100
    ).toFixed(2);

    await cartData.save();

    res
      .status(200)
      .json({ cartItemsCount: cartData.cartItems.length, data: cartData });
  });
}

module.exports = Cart;
