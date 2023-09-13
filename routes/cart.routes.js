const router = require("express").Router();

const {
  addProductToCart,
  getUserCart,
  removeSpecificProduct,
  clearItems,
  updateItemQuantity,
  applyCoupon,
} = require("../controllers/cart.controllers");
const Auth = require("../controllers/auth.controllers");

router.use(Auth.authorize, Auth.isAllowed("user"));

router.route("/").post(addProductToCart).get(getUserCart).delete(clearItems);

router.put("/applyCoupon", applyCoupon);

router
  .route("/:idProductInCart")
  .put(updateItemQuantity)
  .delete(removeSpecificProduct);

module.exports = router;
