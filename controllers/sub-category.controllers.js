const subCategoryModel = require("../models/sub-category.models");
const {
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} = require("./handler.controllers");

class SubCategory {
  // @nested route    POST /api/v1/categories/:categoryId/subcategories
  static specificCategory = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
  };

  // @desc      Create SubCategory
  // @route     POST /api/v1/subcategories
  // @access    Private/Admin - Super Admin
  static addSubCategory = addDoc(subCategoryModel);

  // @nested route    GET /api/v1/categories/:categoryId/subcategories
  static filterByCategory = (req, res, next) => {
    let filterObj = {};
    if (req.params.categoryId) filterObj = { category: req.params.categoryId };
    req.filterObj = filterObj;
    next();
  };

  // @desc      getAllSubCategories
  // @route     GET /api/v1/subcategories
  // @access    Public
  static getSubCategories = getDocs(subCategoryModel);

  // @desc      getSubCategory
  // @route     GET /api/v1/subcategories/:id
  // @access    Public
  static getSubCategory = getDoc(subCategoryModel);

  // @desc      updateSubCategory
  // @route     PUT /api/v1/subcategories/:id
  // @access    Private/Admin - Super Admin
  static updateSubCategory = updateDoc(subCategoryModel);

  // @desc      deleteSubCategory
  // @route     DELETE /api/v1/subcategories/:id
  // @access    Private/Admin - Super Admin
  static deleteSubCategory = deleteDoc(subCategoryModel);
}

module.exports = SubCategory;
