const router = require("express").Router();

const {
  signupValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../helpers/validators/auth.validators");
const {
  login,
  signup,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  uploadUserImage,
  resizeOptions,
  refresh,
  logout,
  authorize,
} = require("../controllers/auth.controllers");

router.post("/signup", uploadUserImage, signupValidator, resizeOptions, signup);

router.post("/login", loginValidator, login);

router.post("/forgotPassword/:type", forgotPassword);
router.post("/verifyCode", verifyResetCode);
router.put("/resetPassword/:id", resetPasswordValidator, resetPassword);

router.post("/refresh", refresh);
router.post("/logout",  logout);

module.exports = router;
