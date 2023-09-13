const router = require("express").Router();
const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../helpers/validators/category.validators");

const {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeOptions,
  destroyImage,
} = require("../controllers/category.controllers");

const Auth = require("../controllers/auth.controllers");
const subCategoryRoutes = require("./sub-category.routes");

router.use("/:categoryId/subcategories", subCategoryRoutes);

router
  .route("/")
  .post(
    Auth.authorize,
    Auth.isAllowed("admin", "SuperAdmin"),
    uploadCategoryImage,
    resizeOptions,
    createCategoryValidator,
    addCategory
  )
  .get(getCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    Auth.authorize,
    Auth.isAllowed("admin", "SuperAdmin"),
    uploadCategoryImage,
    updateCategoryValidator,
    destroyImage,
    resizeOptions,
    updateCategory
  )
  .delete(
    Auth.authorize,
    Auth.isAllowed("admin", "SuperAdmin"),
    deleteCategoryValidator,
    destroyImage,
    deleteCategory
  );

module.exports = router;
