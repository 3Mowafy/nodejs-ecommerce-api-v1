const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middlewares");
const userModel = require("../../models/user.models");

class AuthValidator {
  static signupValidator = [
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
      .withMessage("Confirm Password is required"),

    check("role").custom((role, { req }) => {
      if (req.body.role)
        throw new Error("You don't have permission To access this role feild");

      return true;
    }),

    check("active").custom((active, { req }) => {
      if (req.body.active || active == false)
        throw new Error(
          "You don't have permission To access this active feild"
        );

      return true;
    }),

    check("phone")
      .optional()
      .isMobilePhone()
      .withMessage("invalid phone number")
      .custom(async (phone) => {
        const userData = await userModel.findOne({ phone });
        console.log(userData);
        if (userData) throw new Error("phone is already in use");
      }),
    validatorMiddleware,
  ];

  static loginValidator = [
    check("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("Please enter a valid email address"),

    check("password").notEmpty().withMessage("Password is required"),

    validatorMiddleware,
  ];

  static resetPasswordValidator = [
    check("id").isMongoId().withMessage("Invaild User Id Format"),

    check("confirmNewPassword")
      .notEmpty()
      .withMessage("Please enter a valid password"),

    check("newPassword")
      .notEmpty()
      .withMessage("Please enter a valid password")
      .isStrongPassword()
      .withMessage("Please enter a strong password")
      .custom((pass, { req }) => {
        if (pass != req.body.confirmNewPassword)
          throw new Error("Please enter The same password");

        return true;
      }),

    validatorMiddleware,
  ];
}

module.exports = AuthValidator;
