const router = require("express").Router({ mergeParams: true });
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../helpers/validators/sub-category.validators");

const {
  specificCategory,
  addSubCategory,
  filterByCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/sub-category.controllers");

const Auth = require("../controllers/auth.controllers");

router
  .route("/")
  .post(
    Auth.authorize,
    Auth.isAllowed("admin", "SuperAdmin"),
    specificCategory,
    createSubCategoryValidator,
    addSubCategory
  )
  .get(filterByCategory, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    Auth.authorize,
    Auth.isAllowed("admin", "SuperAdmin"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    Auth.authorize,
    Auth.isAllowed("admin", "SuperAdmin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
