const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [3, "minlength must be greater than Three"],
      maxlength: [30, "minlength must be less than Thirty"],
      required: [true, "Name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      unique: [true, "Phone Number is Duplicated"],
      sparse: true,
    },
    address: String,
    profileImg: String,
    imageId: String,
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    passwordChangedAt: Date,
    resetCode: String,
    resetCodeExp: String,
    resetCodeVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "admin", "SuperAdmin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishList: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
    addresses: [
      {
        id: mongoose.Schema.Types.ObjectId,
        alias: String,
        city: String,
        details: String,
        postalCode: String,
        phone: String,
      },
    ],
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const { password, resetCode, resetCodeExp, resetCodeVerified, __v, ...user } =
    this.toObject();

  return user;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
