const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middlewares");

class BrandValidator {
  static createBrandValidator = [
    check("name")
      .notEmpty()
      .withMessage("Brand name required")
      .isLength({ min: 3 })
      .withMessage("Too Short Name of Brand")
      .isLength({ max: 30 })
      .withMessage("Too Long Name of Brand"),
    validatorMiddleware,
  ];

  static getBrandValidator = [
    check("id").isMongoId().withMessage("Invaild Brand Id Format"),
    validatorMiddleware,
  ];

  static updateBrandValidator = [
    check("id").isMongoId().withMessage("Invaild Brand Id Format"),
    validatorMiddleware,
  ];

  static deleteBrandValidator = [
    check("id").isMongoId().withMessage("Invaild Brand Id Format"),
    validatorMiddleware,
  ];
}

module.exports = BrandValidator;
