const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middlewares");

class CatValidator {
  static createCategoryValidator = [
    check("name")
      .notEmpty()
      .withMessage("Category name required")
      .isLength({ min: 3 })
      .withMessage("Too Short Name of Category")
      .isLength({ max: 30 })
      .withMessage("Too Long Name of Category"),
    validatorMiddleware,
  ];

  static getCategoryValidator = [
    check("id").isMongoId().withMessage("Invaild Category Id Format"),
    validatorMiddleware,
  ];

  static updateCategoryValidator = [
    check("id").isMongoId().withMessage("Invaild Category Id Format"),
    validatorMiddleware,
  ];

  static deleteCategoryValidator = [
    check("id").isMongoId().withMessage("Invaild Category Id Format"),
    validatorMiddleware,
  ];
}

module.exports = CatValidator;
