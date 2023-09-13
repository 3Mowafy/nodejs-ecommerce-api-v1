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
} = require("../controllers/auth.controllers");

router.post("/signup", uploadUserImage, signupValidator, resizeOptions, signup);

router.post("/login", loginValidator, login);

router.post("/forgotPassword/:type", forgotPassword);
router.post("/verifyCode", verifyResetCode);
router.put("/resetPassword/:id", resetPasswordValidator, resetPassword);

module.exports = router;
