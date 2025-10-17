const router = require("express").Router({ mergeParams: true });

const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../helpers/validators/review.validators");
const {
  userId,
  addReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  specificProduct,
  filterByProduct,
} = require("../controllers/review.controllers");

const Auth = require("../controllers/auth.controllers");

router
  .route("/")
  .post(
    Auth.authorize,
    Auth.isAllowed("user"),
    specificProduct,
    createReviewValidator,
    userId,
    addReview
  )
  .get(filterByProduct, getReviews);

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    Auth.authorize,
    Auth.isAllowed("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    Auth.authorize,
    Auth.isAllowed("user", "SuperAdmin"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
