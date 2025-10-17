const asyncHandler = require("express-async-handler");

const userModel = require("../models/user.models");

class WishList {
  // @desc         Add Product to wish list
  // @route        POST /api/v1/wishlist
  // @access       Private/User
  static addProductToWishList = asyncHandler(async (req, res) => {
    const userData = await userModel.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishList: req.body.productId } },
      { new: true }
    );

    res.status(200).json({ data: userData.wishList });
  });

  // @desc         Get wishList
  // @route        GET /api/v1/wishlist
  // @access       Private/User
  static getProductsFromWishList = asyncHandler(async (req, res) => {
    const userData = await userModel
      .findById(req.user._id)
      .populate("wishList");

    res
      .status(200)
      .json({ results: userData.wishList.length, data: userData.wishList });
  });

  // @desc         Delete Product From wishList
  // @route        DELETE /api/v1/wishlist/:id
  // @access       Private/User
  static removeProductFromWishList = asyncHandler(async (req, res) => {
    const userData = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishList: req.params.id },
      },
      { new: true }
    );

    res.status(200).send({
      message: "Product has been removed from wish list",
      data: userData.wishList,
    });
  });
}

module.exports = WishList;
