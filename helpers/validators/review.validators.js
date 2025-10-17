const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validator.middlewares");
const reviewModel = require("../../models/review.models");
const productModel = require("../../models/product.models");

class ReviewValidator {
  static createReviewValidator = [
    check("ratings")
      .notEmpty()
      .withMessage("must be choose rating")
      .isFloat()
      .isLength({ min: 1 })
      .withMessage("rating should be greater than or equal 1.0")
      .isLength({ max: 5 })
      .withMessage("rating should be less than or equal 5.0"),

    check("user").custom(async (val, { req }) => {
      if (val) throw new Error("You Cannot specify a user id");

      const reviewData = await reviewModel.findOne({
        user: req.user._id,
        product: req.body.product,
      });

      if (reviewData)
        throw new Error("user already has review for this product");

      return true;
    }),

    check("product")
      .notEmpty()
      .withMessage("product Id is required")
      .isMongoId()
      .withMessage("invalid id Format")
      .custom(async (val, { req }) => {
        const productData = await productModel.findById(req.body.product);
        if (!productData)
          throw new Error(`product with id (${req.body.product}) not found`);

        return true;
      }),

    validatorMiddleware,
  ];

  static getReviewValidator = [
    check("id").isMongoId().withMessage("invalid id Format"),
    validatorMiddleware,
  ];

  static updateReviewValidator = [
    check("id").isMongoId().withMessage("invalid id Format"),

    check("ratings").custom(async (val, { req }) => {
      if (val < 1 || val > 5)
        throw new Error("ratings must be between 1 and 5");
      const reviewData = await reviewModel.findById(req.params.id);
      if (!reviewData)
        throw new Error(`No review exists for this id (${req.params.id})`);

      if (reviewData.user._id.toString() != req.user._id.toString())
        throw new Error("can't edit review another user");

      return true;
    }),
    validatorMiddleware,
  ];

  static deleteReviewValidator = [
    check("id").isMongoId().withMessage("invalid id Format"),
    check("user").custom(async (val, { req }) => {
      if (req.user.role == "user") {
        const reviewData = await reviewModel.findById(req.params.id);
        if (!reviewData)
          throw new Error(`No review exists for this id (${req.params.id})`);

        if (reviewData.user._id.toString() != req.user._id.toString())
          throw new Error("can't delete review another user");
      }

      return true;
    }),
    validatorMiddleware,
  ];
}

module.exports = ReviewValidator;
