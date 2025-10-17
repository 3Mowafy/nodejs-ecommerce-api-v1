const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validator.middlewares");
const productModel = require("../../models/product.models");

class WishListValidator {
  static addProductToWishListValidator = [
    check("productId")
      .notEmpty()
      .isMongoId()
      .withMessage("invalid product id")
      .custom(async (val) => {
        const productData = await productModel.findById(val);
        if (!productData) throw new Error("product not found in database");
      }),
    validatorMiddleware,
  ];

  static removeProductFromWishListValidator = [
    check("id").isMongoId().withMessage("invalid product id"),
    validatorMiddleware,
  ];
}

module.exports = WishListValidator;
