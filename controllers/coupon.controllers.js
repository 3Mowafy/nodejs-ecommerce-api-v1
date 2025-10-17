const couponModel = require("../models/coupon.models");
const {
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} = require("./handler.controllers");

class Coupons {
  // @desc         Create a new Coupon
  // @route        POST /api/v1/coupons
  // @access       Private/Admin - SuperAdmin
  static createCoupon = addDoc(couponModel);

  // @desc         Get All Coupons
  // @route        GET /api/v1/coupons
  // @access       Private/Admin - SuperAdmin
  static getCoupons = getDocs(couponModel);

  // @desc         Get Specific Coupon
  // @route        GET /api/v1/coupons:/id
  // @access       Private/Admin - SuperAdmin
  static getCoupon = getDoc(couponModel);

  // @desc         Update Specific Coupon
  // @route        PUT /api/v1/coupons:/id
  // @access       Private/Admin - SuperAdmin
  static updateCoupon = updateDoc(couponModel);

  // @desc         Delete Specific Coupon
  // @route        DELETE /api/v1/coupons:/id
  // @access       Private/Admin - SuperAdmin
  static deleteCoupon = deleteDoc(couponModel);
}

module.exports = Coupons;
