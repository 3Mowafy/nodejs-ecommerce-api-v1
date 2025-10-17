const router = require("express").Router();
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../helpers/validators/product.validators");

const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeOptions,
  destroyImage,
} = require("../controllers/product.controllers");

const Auth = require("../controllers/auth.controllers");
const reviewsRoute = require("./review.routes");

router.use("/:productId/reviews", reviewsRoute);

router
  .route("/")
  .post(
    Auth.authorize,
    Auth.isAllowed("admin", "SuperAdmin"),
    uploadProductImage,
    createProductValidator,
    resizeOptions,
    addProduct
  )
  .get(getProducts);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    Auth.authorize,
    Auth.isAllowed("admin", "SuperAdmin"),
    uploadProductImage,
    updateProductValidator,
    destroyImage,
    resizeOptions,
    updateProduct
  )
  .delete(
    Auth.authorize,
    Auth.isAllowed("admin", "SuperAdmin"),
    deleteProductValidator,
    destroyImage,
    deleteProduct
  );

module.exports = router;
