const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");

const { singleFileUpload } = require("../middlewares/fileUpload.middlewares");
const cloudinary = require("../helpers/cloudinary.helpers");
const userModel = require("../models/user.models");
const ApiError = require("../helpers/apiError.helpers");
const { getDoc, getDocs, updateDoc } = require("./handler.controllers");

class User {
  static uploadUserImage = singleFileUpload("profileImg");

  static resizeOptions = asyncHandler(async (req, res, next) => {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        width: 600,
        height: 600,
        format: "jpg",
        public_id: `Users/users-${req.file.filename}-${Date.now()}`,
      });

      req.body.profileImg = result.secure_url;
      req.body.imageId = result.public_id;
    }

    next();
  });

  static destroyImage = asyncHandler(async (req, res, next) => {
    if (req.file || req.method === "DELETE") {
      const userData = await userModel.findById(req.params.id);
      await cloudinary.uploader.destroy(userData?.imageId || " ");
      if (req.file) {
        userData.profileImg = "";
        userData.imageId = "";
      }
    }
    next();
  });

  // @desc        Add New User
  // @route       POST /api/v1/users
  // @access      Private
  static addUser = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    if (name) req.body.slug = slugify(name);

    if (req.body.role === "SuperAdmin")
      return next(
        new ApiError("Can't create a new role for a user with this role", 403)
      );

    const docData = await userModel.create(req.body);

    res.status(201).json({
      data: docData,
    });
  });

  // @desc        Get All Users
  // @route       GET /api/v1/users
  // @access      Private
  static getUsers = getDocs(userModel);

  // @desc        Get Specific User
  // @route       GET /api/v1/users/:id
  // @access      Private
  static getUser = getDoc(userModel);

  // @desc        Update User
  // @route       PUT /api/v1/users/:id
  // @access      Private
  static updateUser = updateDoc(userModel);

  // @desc        Update User Password
  // @route       PUT /api/v1/users/changepassword/:id
  // @access      Private
  static updateUserPassword = asyncHandler(async (req, res, next) => {
    const { password } = req.body;

    const docData = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        password: await bcrypt.hash(password, 12),
        passwordChangedAt: Date.now(),
      },
      { new: true }
    );

    if (!docData)
      return next(
        new ApiError(`Doc with (${req.params.id}) is not found`, 404)
      );

    res.status(200).json({ data: docData });
  });

  // @desc        Delete User
  // @route       DELETE /api/v1/users/:id
  // @access      Private
  static deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const docData = await userModel.findOneAndDelete({
      _id: id,
      role: { $ne: "SuperAdmin" },
    });

    if (!docData)
      return next(
        new ApiError(
          `Doc with (${id}) is not found or you can't have permissions to delete it`,
          404
        )
      );

    res.status(200).json({ message: `Doc with id (${id}) has been deleted` });
  });

  // @desc        Get My Profile
  // @route       GET /api/v1/users/profile
  // @access      Private
  static getMe = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
  });
}

module.exports = User;
