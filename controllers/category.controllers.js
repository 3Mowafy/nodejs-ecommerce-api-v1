const asyncHandler = require("express-async-handler");

const cloudinary = require("../helpers/cloudinary.helpers");
const categoryModel = require("../models/category.models");
const { singleFileUpload } = require("../middlewares/fileUpload.middlewares");
const {
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} = require("./handler.controllers");

class Category {
  static uploadCategoryImage = singleFileUpload("image");

  static resizeOptions = asyncHandler(async (req, res, next) => {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        width: 600,
        height: 600,
        format: "jpg",
        public_id: `Categories/categories-${req.file.filename}-${Date.now()}`,
      });

      req.body.image = result.secure_url;
      req.body.imgId = result.public_id;
    }

    next();
  });

  static destroyImage = asyncHandler(async (req, res, next) => {
    if (req.file || req.method === "DELETE") {
      const categoryData = await categoryModel.findById(req.params.id);
      await cloudinary.uploader.destroy(categoryData?.imgId || " ");
      if (req.file) {
        categoryData.image = "";
        categoryData.imgId = "";
      }
    }
    next();
  });

  // @desc      Create a new category
  // @route     POST /api/v1/categories
  // @access    Private/Admin - Super Admin
  static addCategory = addDoc(categoryModel);

  // @desc      Get list of categories
  // @route     GET /api/v1/categories || /api/v1/categories?page=1&limit=5
  // @access    Public
  static getCategories = getDocs(categoryModel);

  // @desc      Get a specific category
  // @route     GET /api/v1/categories/:id
  // @access    Public
  static getCategory = getDoc(categoryModel);

  // @desc      Update a specific category
  // @route     PUT /api/v1/categories/:id
  // @access    Private/Admin - Super Admin
  static updateCategory = updateDoc(categoryModel);
  // @desc      Delete a specific category
  // @route     DELETE /api/v1/categories/:id
  // @access    Private/Admin - Super Admin
  static deleteCategory = deleteDoc(categoryModel);
}

module.exports = Category;
