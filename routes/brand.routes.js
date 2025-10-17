const router = require("express").Router();
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../helpers/validators/brand.validators");

const {
  addBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeOptions,
  destroyImage,
} = require("../controllers/brand.controllers");

const Auth = require("../controllers/auth.controllers");

router
  .route("/")
  .post(
    Auth.authorize,
    Auth.isAllowed("admin", "SuperAdmin"),
    uploadBrandImage,
    createBrandValidator,
    resizeOptions,
    addBrand
  )
  .get(getBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    Auth.authorize,
    Auth.isAllowed("admin", "SuperAdmin"),
    uploadBrandImage,
    updateBrandValidator,
    destroyImage,
    resizeOptions,
    updateBrand
  )
  .delete(
    Auth.authorize,
    Auth.isAllowed("admin", "SuperAdmin"),
    deleteBrandValidator,
    destroyImage,
    deleteBrand
  );

module.exports = router;
