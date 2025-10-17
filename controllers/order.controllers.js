const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../helpers/apiError.helpers");
const { getDocs } = require("./handler.controllers");

const userModel = require("../models/user.models");
const cartModel = require("../models/cart.models");
const orderModel = require("../models/order.models");
const productModel = require("../models/product.models");

class Order {
  // @desc        create Cash Order
  // @route       POST /api/v1/orders/:cartId
  // @access      Private/User
  static createCashOrder = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;

    const cartData = await cartModel.findById(req.params.cartId);

    if (!cartData)
      return next(
        new ApiError(`Not Found Cart With Id (${req.params.cartId})`, 404)
      );

    const cartPrice = cartData.cartAfterDiscount
      ? cartData.cartAfterDiscount
      : cartData.cartTotalPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    const orderData = await orderModel.create({
      user: req.user._id,
      cartItems: cartData.cartItems,
      shippingAdress: req.body.shippingAdress,
      totalOrderPrice,
    });

    if (orderData) {
      const bulkOptions = cartData.cartItems.map((product) => ({
        updateOne: {
          filter: {
            _id: product.product,
          },
          update: {
            $inc: { quantity: -product.quantity, sold: +product.quantity },
          },
        },
      }));

      await productModel.bulkWrite(bulkOptions, {});

      await cartModel.findByIdAndDelete(req.params.cartId);
    } else {
      return next(new ApiError("can't Find Order", 404));
    }

    res.status(201).json({ data: orderData });
  });

  static filterOrdersByUser = asyncHandler(async (req, res, next) => {
    if (req.user.role === "user") req.filterObj = { user: req.user._id };
    next();
  });

  // @desc        Get All Orders
  // @route       GET /api/v1/orders
  // @access      Private/User - SuperAdmin - admin
  static getAllOrders = getDocs(orderModel);

  // @desc        Get Specific Order
  // @route       GET /api/v1/orders/:id
  // @access      Private/User - SuperAdmin - admin
  static getSpecificOrder = asyncHandler(async (req, res, next) => {
    const orderData = await orderModel.findById(req.params.id);

    if (
      req.user.role === "user" &&
      orderData.user._id.toString() !== req.user._id.toString()
    )
      return next(new ApiError("No Order For this id To current user", 400));

    res.status(200).json({
      data: orderData,
    });
  });

  // @desc        Update Specific Order To Paid
  // @route       GET /api/v1/orders/:id/pay
  // @access      Private/ SuperAdmin - admin
  static updateSpecificOrderToPaid = asyncHandler(async (req, res, next) => {
    const orderData = await orderModel.findById(req.params.id);
    if (!orderData)
      return next(
        new ApiError("Order with id (${req.params.id}) Not Found", 404)
      );

    orderData.isPaid = true;
    orderData.paidAt = Date.now();

    await orderData.save();
    res.status(200).json({ data: orderData });
  });

  // @desc        Update Specific Order To Delivered
  // @route       GET /api/v1/orders/:id/deliver
  // @access      Private/ SuperAdmin - admin
  static updateSpecificOrderToDelivered = asyncHandler(
    async (req, res, next) => {
      const orderData = await orderModel.findById(req.params.id);
      if (!orderData)
        return next(
          new ApiError("Order with id (${req.params.id}) Not Found", 404)
        );

      orderData.isDelivered = true;
      orderData.deliveredAt = Date.now();

      await orderData.save();
      res.status(200).json({ data: orderData });
    }
  );
  //______________________________________& Stripe &______________________________________
  // @desc        create Stripe Session And Send it in response
  // @route       GET /api/v1/orders/stripe/:cartId
  // @access      Private/User
  static stripeSession = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;

    const cartData = await cartModel.findById(req.params.cartId);
    if (!cartData)
      return next(
        new ApiError(`Not Found Cart With Id (${req.params.cartId})`, 404)
      );

    const cartPrice = cartData.cartAfterDiscount
      ? cartData.cartAfterDiscount
      : cartData.cartTotalPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "EGP",
            unit_amount: totalOrderPrice * 100,
            product_data: {
              name: req.user.name,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.hostname}/orders`,
      cancel_url: `${req.protocol}://${req.hostname}/cart`,
      customer_email: req.user.email,
      client_reference_id: req.params.cartId,
      metadata: req.body.shippingAdress,
    });

    res.status(200).json({ session });
  });

  static #createCardOrder = async (session) => {
    const cartId = session.client_reference_id;
    const shippingAdress = session.metadata;
    const totalOrderPrice = session.amount_total / 100;
    const email = session.customer_email;

    const cartData = await cartModel.findById(cartId);
    const UserData = await userModel.findOne({ email });

    const orderData = await orderModel.create({
      user: UserData._id,
      cartItems: cartData.cartItems,
      shippingAdress,
      totalOrderPrice,
      PaymentMethodType: "card",
      isPaid: true,
      paidAt: Date.now(),
    });

    if (orderData) {
      const bulkOptions = cartData.cartItems.map((product) => ({
        updateOne: {
          filter: {
            _id: product.product,
          },
          update: {
            $inc: { quantity: -product.quantity, sold: +product.quantity },
          },
        },
      }));

      await productModel.bulkWrite(bulkOptions, {});

      await cartModel.findByIdAndDelete(cartId);
    }
  };

  // @desc        Stripe Webhook
  // @route       POST /webhook
  // @access      Private/User
  static webhookHandler = asyncHandler(async (req, res, next) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_SIGNING_KEY
      );
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
      this.#createCardOrder(event.data.object);
    }

    res.status(200).json({ received: true });
  });
}

module.exports = Order;
