// const app = require("./app.src");

const categoryRoutes = require("../routes/category.routes");
const subCategoryRoutes = require("../routes/sub-category.routes");
const brandRoutes = require("../routes/brand.routes");
const productRoutes = require("../routes/product.routes");
const userRoutes = require("../routes/user.routes");
const authRoutes = require("../routes/auth.routes");
const reviewRoutes = require("../routes/review.routes");
const wishListRoutes = require("../routes/wishlist.routes");
const addressesRoutes = require("../routes/address.routes");
const couponsRoutes = require("../routes/coupon.routes");
const cartRoutes = require("../routes/cart.routes");
const ordersRoutes = require("../routes/order.routes");

const routesHandler = (app) => {
  app.use("/api/v1/categories", categoryRoutes);
  app.use("/api/v1/subcategories", subCategoryRoutes);
  app.use("/api/v1/brands", brandRoutes);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/reviews", reviewRoutes);
  app.use("/api/v1/wishlist", wishListRoutes);
  app.use("/api/v1/addresses", addressesRoutes);
  app.use("/api/v1/coupons", couponsRoutes);
  app.use("/api/v1/cart", cartRoutes);
  app.use("/api/v1/orders", ordersRoutes);
};

module.exports = routesHandler;
