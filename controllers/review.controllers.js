const reviewModel = require("../models/review.models");
const {
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  deleteDoc,
} = require("./handler.controllers");

class Review {
  static userId = (req, res, next) => {
    req.body.user = req.user._id;
    next();
  };

  // @nested Route    POST /api/v1/:productId/reviews
  static specificProduct = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    next();
  };

  // @desc        create a new Review
  // @route       POST /api/v1/reviews
  // @access      private
  static addReview = addDoc(reviewModel);

  // @nested Route   GET /api/v1/:productId/reviews
  static filterByProduct = (req, res, next) => {
    let filterObj = {};
    if (req.params.productId) filterObj = { product: req.params.productId };
    req.filterObj = filterObj;
    next();
  };

  // @desc        Get All Reviews
  // @route       GET /api/v1/reviews
  // @access      public
  static getReviews = getDocs(reviewModel);

  // @desc        Get Specific Review
  // @route       GET /api/v1/reviews/:id
  // @access      public
  static getReview = getDoc(reviewModel);

  // @desc        Update Specific Review
  // @route       PUT /api/v1/reviews/:id
  // @access      private
  static updateReview = updateDoc(reviewModel);

  // @desc        Delete Specific Review
  // @route       DELETE /api/v1/reviews/:id
  // @access      private
  static deleteReview = deleteDoc(reviewModel);
}

module.exports = Review;
