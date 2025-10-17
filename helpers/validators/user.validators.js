const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const validatorMiddleware = require("../../middlewares/validator.middlewares");
const userModel = require("../../models/user.models");

class UserValidator {
  static createUserValidator = [
    check("name")
      .notEmpty()
      .withMessage("name is required")
      .isLength({ min: 3 })
      .withMessage("Too Short Name of User")
      .isLength({ max: 30 })
      .withMessage("Too long Name of User"),

    check("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom(async (email) => {
        const userData = await userModel.findOne({ email });
        if (userData) throw new Error("Email is already in use");
      }),

    check("password")
      .notEmpty()
      .withMessage("Password is required")
      .isStrongPassword()
      .withMessage("Must Be Strong Password")
      .custom((password, { req }) => {
        if (password != req.body.confirmpassword)
          throw new Error("Confirm password is incorrect");

        return true;
      }),

    check("confirmpassword")
      .notEmpty()
      .withMessage("Confirm password is required"),

    check("phone")
      .optional()
      .isMobilePhone()
      .withMessage("invalid phone number")
      .custom(async (phone) => {
        const userData = await userModel.findOne({ phone });
        if (userData) throw new Error("phone is already in use");
      }),
    validatorMiddleware,
  ];

  static getUserValidator = [
    check("id").isMongoId().withMessage("Invaild User Id Format"),
    validatorMiddleware,
  ];

  static updateUserValidator = [
    check("id").isMongoId().withMessage("Invaild User Id Format"),

    check("data").custom((val, { req }) => {
      if (
        !(
          req.user._id.toString() === req.params.id ||
          req.user.role === "SuperAdmin"
        )
      )
        throw new Error("Can't Update Data To Another User");

      return true;
    }),

    check("password").custom((password, { req }) => {
      if (req.body.password)
        throw new Error("Cannot change password in this route");

      return true;
    }),

    check("email")
      .optional()
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom(async (email) => {
        const userData = await userModel.findOne({ email });
        if (userData) throw new Error("Email is already in use");
      }),
    validatorMiddleware,
  ];

  static updateUserPasswordValidator = [
    check("id").isMongoId().withMessage("Invaild User Id Format"),
    check("data").custom((val, { req }) => {
      if (
        !(
          req.user._id.toString() === req.params.id ||
          req.user.role === "SuperAdmin"
        )
      )
        throw new Error("Can't Change Password To Another User");

      return true;
    }),

    check("currentpassword")
      .notEmpty()
      .withMessage("Please enter your current password"),

    check("confirmpassword")
      .notEmpty()
      .withMessage("Please enter confirm password"),

    check("password")
      .notEmpty()
      .withMessage("Please enter your new password")
      .isStrongPassword()
      .withMessage("Must Be Strong Password")
      .custom(async (password, { req }) => {
        const userData = await userModel.findById(req.params.id);

        if (!userData) throw new Error("There is no user with this id");

        const isCorrectPassword = await bcrypt.compare(
          req.body.currentpassword,
          userData.password
        );
        if (!isCorrectPassword) {
          throw new Error("Current password is incorrect");
        }

        if (password != req.body.confirmpassword)
          throw new Error("Confirm password is incorrect");

        if (isCorrectPassword && password == req.body.currentpassword)
          throw new Error(
            "Your Password in input feild is already your current password"
          );

        return true;
      }),
    validatorMiddleware,
  ];

  static deleteUserValidator = [
    check("id").isMongoId().withMessage("Invaild User Id Format"),

    check("data").custom((val, { req }) => {
      if (
        !(
          req.user._id.toString() === req.params.id ||
          req.user.role === "SuperAdmin"
        )
      )
        throw new Error("Can't Delete Another User");

      return true;
    }),
    validatorMiddleware,
  ];
}

module.exports = UserValidator;
