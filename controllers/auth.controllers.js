const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const cloudinary = require("../helpers/cloudinary.helpers");
const userModel = require("../models/user.models");
const { singleFileUpload } = require("../middlewares/fileUpload.middlewares");
const ApiError = require("../helpers/apiError.helpers");
const sendEmail = require("../helpers/sendMail.helpers");
const sendSMS = require("../helpers/sendSMS.helpers");
const { sanitizeUser } = require("../helpers/dataSanitization.helpers");

class Auth {
  static uploadUserImage = singleFileUpload("profileImg");

  static resizeOptions = asyncHandler(async (req, res, next) => {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        width: 200,
        height: 200,
        format: "jpg",
        public_id: `Users/users-${req.file.filename}-${Date.now()}`,
      });
      req.body.profileImg = result.secure_url;
      req.body.imageId = result.public_id;
    }

    next();
  });

  static #genToken = (payLoad) =>
    jwt.sign({ userId: payLoad._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });

  // @desc      Create a new User
  // @route     POST  /api/v1/auth/signup
  // @access    public
  static signup = asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.name);
    const userData = await userModel.create(req.body);

    const token = this.#genToken(userData);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
      })
      .status(201)
      .json({ data: sanitizeUser(userData) });
  });

  // @desc      User Login
  // @route     /api/v1/auth/login
  // @access    public
  static login = asyncHandler(async (req, res, next) => {
    const userData = await userModel.findOne({ email: req.body.email });

    if (
      !userData ||
      !(await bcrypt.compare(req.body.password, userData?.password))
    ) {
      return next(new ApiError("incorrect email address or password"));
    }
    const token = this.#genToken(userData);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
      })
      .status(200)
      .json({ data: userData });
  });

  // @desc      Suer if User logged in
  static authorize = asyncHandler(async (req, res, next) => {
    // Recive Token and store it in memory and check if value or empty
    let token;
    if (req.headers.authorization)
      token = req.headers.authorization.replace("Bearer ", "");

    if (!token)
      return next(new ApiError("Invalid Token, please try login again", 401));

    // return token to original Data, and edit errors if token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // check if token belong to user
    const userData = await userModel.findById(decoded.userId);
    if (!userData)
      return next(
        new ApiError("The user is belonging to this token is not exist.", 401)
      );

    // check if user changed password and ckcek if token is after changed password or not
    const lastPasswordChangedTime = parseInt(
      userData.passwordChangedAt?.getTime() / 1000,
      10
    );

    if (lastPasswordChangedTime > decoded.iat) {
      return next(
        new ApiError("Token is un authorized, please try login again", 401)
      );
    }

    req.user = userData;

    next();
  });

  // @desc      check user permissions(Authorization)
  static isAllowed = (...roles) =>
    asyncHandler(async (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ApiError("you are can't allowed to access this route", 403)
        );
      }
      next();
    });

  // Function to Send Message to email
  static #sendResetCodeByEmail = async (userData, randomCode, res) => {
    // Send the reset code to User Email By nodeMailer Package
    const content = `<!DOCTYPE html>
        <html>
          <head>
            <style>
              .msg-info {
                margin-top: 20px;
              }
              .reset-code {
                width: fit-content;
                background: #8a43e736;
                border: thin solid #390083;
                border-radius: 7px;
                padding: 5px 10px;
              }
            </style>
          </head>
          <body>
            <strong>مرحبا ${userData.name}</strong>,
            <div class="msg-info">
              <span>لقد تلقينا طلبًا لإعادة تعيين كلمة السر الخاصة بك على يو شوب.</span>
              <br />
              <span>أدخل رمز إعادة تعيين كلمة السر التالي:</span>
            </div>
            <h1 class="reset-code">${randomCode}</h1>
            <h3>ينتهي الكود بعد 5 دقائق</h3>
            <p>لزيادة أمان حسابك لا تشارك رمز إعادة التعيين مع أي شخص آخر</p>
            <p>
              <strong>فريق عمل يو شوب</strong>
            </p>
          </body>
        </html>`;

    await sendEmail({
      email: userData.email,
      subject: `رمز استرداد حسابك على يو شوب هو ${randomCode}`,
      content,
    });

    userData.resetCode = res.status(200).json({
      message: `reset code sent successfully to ${userData.email}`,
    });
  };

  // Function to Send Message to phone number
  static #sendResetCodeByPhone = async (userData, randomCode, res) => {
    if (!userData.phone)
      return next(
        new ApiError(`No Phone number exists to ${userData.name}`, 404)
      );
    await sendSMS({
      body: `Your U-Shop reset password code ${randomCode}`,
      userPhoneNumber: userData.phone,
    });

    res.status(200).json({
      message: `reset code sent successfully to ${userData.phone}`,
    });
  };

  // @desc      ForgotPassword
  // @route     POST  /api/v1/auth/forgotPassword/:type || email or phone
  // @access    public
  static forgotPassword = asyncHandler(async (req, res, next) => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashRandomCode = crypto
      .createHash("sha256")
      .update(randomCode)
      .digest("hex");

    let userData;

    if (req.params.type === "email") {
      // Check user By Email
      userData = await userModel.findOne({ email: req.body.email });

      this.#sendResetCodeByEmail(userData, randomCode, res);
    } else if (req.params.type === "phone") {
      // Check user By Phone
      userData = await userModel.findOne({ phone: req.body.phone });

      this.#sendResetCodeByPhone(userData, randomCode, res);
    } else {
      return res
        .status(404)
        .send({ message: "The routes you provided do not exist" });
    }

    if (userData) {
      // Code Expire After 10 Minutues
      const codeExpirationTime = Date.now() + 10 * 60 * 1000;
      userData.resetCode = hashRandomCode;
      userData.resetCodeExp = codeExpirationTime;
      userData.resetCodeVerified = false;

      await userData.save();
    } else {
      return next(
        new ApiError(
          `No user exists with Phone Number (${
            req.params.type === "email" ? req.body.email : req.body.phone
          })`,
          404
        )
      );
    }
  });

  // @desc      verify Reset Code
  // @route     POST  /api/v1/auth/verifyCode
  // @access    public
  static verifyResetCode = asyncHandler(async (req, res, next) => {
    const hashResetCode = crypto
      .createHash("sha256")
      .update(req.body.resetCode)
      .digest("hex");

    const userData = await userModel.findOne({
      resetCode: hashResetCode,
      resetCodeExp: { $gt: Date.now() },
    });

    if (!userData) return next(new ApiError("incorrect reset code or expired"));

    userData.resetCodeVerified = true;
    await userData.save();

    res.status(200).send({ status: "success", id: userData._id });
  });

  // @desc      Reset Password
  // @route     PUT /api/v1/auth/resetPassword/:id
  // access     public
  static resetPassword = asyncHandler(async (req, res, next) => {
    const userData = await userModel.findById(req.params.id);

    if (!userData) return next(new ApiError("no user belong to this id", 404));

    if (!userData.resetCodeVerified)
      return next(
        new ApiError("please back to verify Code, and try again", 400)
      );

    userData.password = req.body.newPassword;
    userData.resetCode = undefined;
    userData.resetCodeExp = undefined;
    userData.resetCodeVerified = false;
    await userData.save();

    const token = this.#genToken(userData);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
      })
      .status(200)
      .send({ message: "success" });
  });
}

module.exports = Auth;
