const router = require("express").Router();

const {
  addProductToWishListValidator,
  removeProductFromWishListValidator,
} = require("../helpers/validators/wishlist.validators");

const {
  addProductToWishList,
  getProductsFromWishList,
  removeProductFromWishList,
} = require("../controllers/wishlist.controllers");
const Auth = require("../controllers/auth.controllers");

router.use(Auth.authorize, Auth.isAllowed("user"));

router
  .route("/")
  .post(addProductToWishListValidator, addProductToWishList)
  .get(getProductsFromWishList);

router.delete(
  "/:id",
  removeProductFromWishListValidator,
  removeProductFromWishList
);

module.exports = router;
