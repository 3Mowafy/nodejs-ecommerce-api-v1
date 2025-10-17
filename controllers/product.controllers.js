const asyncHandler = require("express-async-handler");

const cloudinary = require("../helpers/cloudinary.helpers");
const { multiFileUpload } = require("../middlewares/fileUpload.middlewares");
const productModel = require("../models/product.models");
const {
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} = require("./handler.controllers");

class Product {
  static uploadProductImage = multiFileUpload([
    {
      name: "imageCover",
      maxCount: 1,
    },
    { name: "images", maxCount: 5 },
  ]);

  static resizeOptions = asyncHandler(async (req, res, next) => {
    const { imageCover, images } = req.files;
    if (imageCover) {
      const result = await cloudinary.uploader.upload(imageCover[0].path, {
        width: 600,
        height: 600,
        format: "jpg",
        public_id: `Products/product-${imageCover[0].filename}-${Date.now()}`,
      });

      req.body.imageCover = result.secure_url;
      req.body.imgCoverId = result.public_id;
    }

    if (images) {
      req.body.images = [];
      await Promise.all(
        images.map(async (img) => {
          const result = await cloudinary.uploader.upload(img.path, {
            width: 600,
            height: 600,
            format: "jpg",
            public_id: `Products/product-${img.filename}-${Date.now()}`,
          });
          req.body.images.push({
            id: result.public_id,
            image: result.secure_url,
          });
        })
      );
    }

    next();
  });

  static destroyImage = asyncHandler(async (req, res, next) => {
    const productData = await productModel.findById(req.params.id);

    if (req.files?.imageCover || req.method === "DELETE") {
      await cloudinary.uploader.destroy(productData?.imgCoverId || " ");
      if (req.files?.imageCover) {
        productData.imageCover = "";
        productData.imgCoverId = "";
      }
    }

    if (req.files?.images || req.method === "DELETE") {
      if (productData?.images) {
        await Promise.all(
          productData.images.map(async (image) => {
            await cloudinary.uploader.destroy(image?.id || " ");
          })
        );
        productData.images = [];
      }
    }

    next();
  });
  // @desc      Create a new product
  // @route     POST /api/v1/products
  // @access    Private/Admin - Super Admin
  static addProduct = addDoc(productModel);

  // @desc      Get list of products
  // @route     GET /api/v1/products || /api/v1/products?page=1&limit=5
  // @access    Public
  static getProducts = getDocs(productModel, "products");

  // @desc      Get a specific product
  // @route     GET /api/v1/products/:id
  // @access    Public
  static getProduct = getDoc(productModel, "reviews");

  // @desc      Update a specific product
  // @route     PUT /api/v1/products/:id
  // @access    Private/Admin - Super Admin
  static updateProduct = updateDoc(productModel, "product");

  // @desc      Delete a specific product
  // @route     DELETE /api/v1/products/:id
  // @access    Private/Admin - Super Admin
  static deleteProduct = deleteDoc(productModel);
}

module.exports = Product;
