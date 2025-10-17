const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validator.middlewares");
const userModel = require("../../models/user.models");

class WishListValidator {
  static addAddressToUserValidator = [
    check("alias")
      .isLength({ min: 3 })
      .withMessage("Please enter minimum 3 characters")
      .custom(async (val, { req }) => {
        const userData = await userModel.findOne({
          _id: req.user._id,
          addresses: { $elemMatch: { alias: val } },
        });

        if (userData) throw new Error("This alias is exist.");

        return true;
      }),

    check("details")
      .isLength({ min: 3 })
      .withMessage("Please enter minimum 3 characters"),

    check("city")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Please enter minimum 3 characters"),

    check("postalCode")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Please enter minimum 3 characters"),

    check("phone")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Please enter minimum 3 characters")
      .isMobilePhone()
      .withMessage("Please enter a valid phone number"),
    validatorMiddleware,
  ];

  static updateAddressValidator = [
    check("alias")
      .optional()
      .custom(async (val, { req }) => {
        const userData = await userModel.findOne({
          _id: req.user._id,
          addresses: {
            $elemMatch: { _id: { $ne: req.params.id }, alias: val },
          },
        });

        if (userData) throw new Error("This alias is exist.");

        return true;
      }),

    check("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Please enter a valid phone number"),
    validatorMiddleware,
  ];

  static removeAddressFromUserAddressesValidator = [
    check("id").isMongoId().withMessage("invalid Address id"),
    validatorMiddleware,
  ];
}

module.exports = WishListValidator;
