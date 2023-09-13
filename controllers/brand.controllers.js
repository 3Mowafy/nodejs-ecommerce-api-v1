const asyncHandler = require("express-async-handler");

const cloudinary = require("../helpers/cloudinary.helpers");
const { singleFileUpload } = require("../middlewares/fileUpload.middlewares");
const brandModel = require("../models/brand.models");
const {
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} = require("./handler.controllers");

class Brand {
  static uploadBrandImage = singleFileUpload("image");

  static resizeOptions = asyncHandler(async (req, res, next) => {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        width: 600,
        height: 600,
        format: "jpg",
        public_id: `Brands/brands-${req.file.filename}-${Date.now()}`,
      });

      req.body.image = result.secure_url;
      req.body.imgId = result.public_id;
    }

    next();
  });

  static destroyImage = asyncHandler(async (req, res, next) => {
    if (req.file || req.method === "DELETE") {
      const brandData = await brandModel.findById(req.params.id);
      await cloudinary.uploader.destroy(brandData?.imgId || " ");
      if (req.file) {
        brandData.image = "";
        brandData.imgId = "";
      }
    }
    next();
  });
  // @desc      Create a new brand
  // @route     POST /api/v1/brands
  // @access    Private/Admin - Super Admin
  static addBrand = addDoc(brandModel);

  // @desc      Get list of brands
  // @route     GET /api/v1/brands || /api/v1/brands?page=1&limit=5
  // @access    Public
  static getBrands = getDocs(brandModel);

  // @desc      Get a specific brand
  // @route     GET /api/v1/brands/:id
  // @access    Public
  static getBrand = getDoc(brandModel);

  // @desc      Update a specific brand
  // @route     PUT /api/v1/brands/:id
  // @access    Private/Admin - Super Admin
  static updateBrand = updateDoc(brandModel);

  // @desc      Delete a specific brand
  // @route     DELETE /api/v1/brands/:id
  // @access    Private/Admin - Super Admin
  static deleteBrand = deleteDoc(brandModel);
}

module.exports = Brand;
