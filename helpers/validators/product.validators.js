const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middlewares");
const categoryModel = require("../../models/category.models");
const subCategoryModel = require("../../models/sub-category.models");

class ProdValidator {
  static createProductValidator = [
    check("title")
      .notEmpty()
      .withMessage("Product title is required")
      .isLength({ min: 5 })
      .withMessage("Too Short title of Product")
      .isLength({ max: 100 })
      .withMessage("Too Long title of Product"),

    check("description")
      .notEmpty()
      .withMessage("Product description is required")
      .isLength({ min: 20 })
      .withMessage("Too Short description of Product"),

    check("quantity")
      .notEmpty()
      .withMessage("Product quantity is required")
      .isNumeric()
      .withMessage("Product quantity must be a number"),

    check("sold")
      .optional()
      .isNumeric()
      .withMessage("Product sold must be a number"),

    check("price")
      .notEmpty()
      .withMessage("product price is required")
      .isNumeric()
      .withMessage("Product price must be a number")
      .isLength({ max: 50000 })
      .withMessage("Too Long Price of Product"),

    check("priceAfterDiscount")
      .optional()
      .isNumeric()
      .withMessage("price after discount must be a number")
      .toFloat()
      .custom((val, { req }) => {
        if (req.body.price <= val)
          throw new Error("price after discount must be less than price");

        return true;
      }),

    check("colors")
      .optional()
      .isArray()
      .withMessage("colors should be an array of strings"),

    check("images")
      .optional()
      .isArray()
      .withMessage("Product images should be an array of strings"),

    check("category")
      .notEmpty()
      .withMessage("Product category is required")
      .isMongoId()
      .withMessage("Invaild category Id Format")
      .custom(async (cat) => {
        const category = await categoryModel.findById(cat);
        if (!category) throw new Error("Product category is not found");
      }),

    check("subCategory")
      .optional()
      .isMongoId()
      .withMessage("Invaild category Id Format")
      .custom(async (val) => {
        const subCategory = await subCategoryModel.find({
          _id: { $exists: true, $in: val },
        });

        if (val.length !== subCategory.length)
          throw new Error(
            "Product subcategories is not found or some values is duplicated"
          );
      })
      .custom(async (val, { req }) => {
        const subCategory = await subCategoryModel.find({
          category: req.body.category,
        });

        const subCatIdsValidator = [];

        subCategory.forEach((subCat) =>
          subCatIdsValidator.push(subCat._id.toString())
        );

        const check = val.every((id) => subCatIdsValidator.includes(id));

        if (!check)
          throw new Error(
            "Product subcategories is not belong to this category"
          );
      }),

    check("brand")
      .optional()
      .isMongoId()
      .withMessage("Invaild category Id Format"),

    check("ratingsAverage")
      .optional()
      .isNumeric()
      .withMessage("ratingsAverage must be a number")
      .isLength({ min: 1 })
      .withMessage("rating should be greater than or equal 1.0")
      .isLength({ max: 5 })
      .withMessage("rating should be less than or equal 5.0"),

    check("ratingsQuantity")
      .optional()
      .isNumeric()
      .withMessage("ratingsQuantity must be a number"),

    validatorMiddleware,
  ];

  static getProductValidator = [
    check("id").isMongoId().withMessage("Invaild Product Id Format"),
    validatorMiddleware,
  ];

  static updateProductValidator = [
    check("id").isMongoId().withMessage("Invaild Product Id Format"),
    validatorMiddleware,
  ];

  static deleteProductValidator = [
    check("id").isMongoId().withMessage("Invaild Product Id Format"),
    validatorMiddleware,
  ];
}

module.exports = ProdValidator;
