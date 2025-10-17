const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middlewares");

class CouponValidator {
  static createCouponValidator = [
    check("name").notEmpty().withMessage("Coupon name required"),

    check("expire")
      .notEmpty()
      .withMessage("Expire Date is required for coupons")
      .isDate({ format: "yyyy-MM-dd" })
      .withMessage("Expire must be a date"),

    check("discount")
      .notEmpty()
      .withMessage("Expire Discount is required for coupons")
      .isNumeric()
      .withMessage("Discount must be a number"),

    validatorMiddleware,
  ];

  static getCouponValidator = [
    check("id").isMongoId().withMessage("Invaild Coupon Id Format"),
    validatorMiddleware,
  ];

  static updateCouponValidator = [
    check("id").isMongoId().withMessage("Invaild Coupon Id Format"),
    validatorMiddleware,
  ];

  static deleteCouponValidator = [
    check("id").isMongoId().withMessage("Invaild Coupon Id Format"),
    validatorMiddleware,
  ];
}

module.exports = CouponValidator;
