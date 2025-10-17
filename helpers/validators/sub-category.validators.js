const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middlewares");

class SubCatValidator {
  static createSubCategoryValidator = [
    check("name")
      .notEmpty()
      .withMessage("SubCategory name required")
      .isLength({ min: 2 })
      .withMessage("Too Short Name of SubCategory")
      .isLength({ max: 30 })
      .withMessage("Too Long Name of SubCategory"),
    check("category")
      .notEmpty()
      .withMessage("SubCategory Must Be Part of Category")
      .isMongoId()
      .withMessage("Invaild Category Id Format"),
    validatorMiddleware,
  ];

  static getSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invaild Category Id Format"),
    validatorMiddleware,
  ];

  static updateSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invaild Category Id Format"),
    validatorMiddleware,
  ];

  static deleteSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invaild Category Id Format"),
    validatorMiddleware,
  ];
}

module.exports = SubCatValidator;
