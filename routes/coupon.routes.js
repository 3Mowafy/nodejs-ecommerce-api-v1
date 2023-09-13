const router = require("express").Router();

const {
  createCouponValidator,
  getCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require("../helpers/validators/coupon.validators");

const {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/coupon.controllers");

const Auth = require("../controllers/auth.controllers");

router.use(Auth.authorize, Auth.isAllowed("admin", "SuperAdmin"));

router.route("/").post(createCouponValidator, createCoupon).get(getCoupons);

router
  .route("/:id")
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
