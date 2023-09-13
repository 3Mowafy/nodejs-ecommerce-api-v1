const asyncHandler = require("express-async-handler");

const userModel = require("../models/user.models");

class Address {
  // @desc         Create a new Address
  // @route        POST /api/v1/addresses
  // @access       Private/User
  static addAdressToUser = asyncHandler(async (req, res) => {
    const userData = await userModel.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { addresses: req.body } },
      { new: true }
    );

    res.status(200).json({ data: userData.addresses });
  });

  // @desc         Get A user Addresses
  // @route        POST /api/v1/addresses
  // @access       Private/User
  static getUserAddresses = asyncHandler(async (req, res) => {
    const userData = await userModel.findById(req.user._id);

    res
      .status(200)
      .json({ result: userData.addresses.length, data: userData.addresses });
  });

  // @desc         Update Specific Address
  // @route        PUT /api/v1/addresses/:id
  // @access       Private/User
  static updateAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userData = await userModel.findOneAndUpdate(
      { "addresses._id": id },
      { $set: { "addresses.$": { _id: id, ...req.body } } },
      { new: true }
    );
    const address = userData.addresses.find(
      (address) => address._id.toString() === id.toString()
    );

    res.status(200).json({ data: address });
  });

  // @desc         Delete Specific Address
  // @route        DELETE /api/v1/addresses/:id
  // @access       Private/User
  static removeAddressFromUserAddresses = asyncHandler(async (req, res) => {
    const userData = await userModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { addresses: { _id: req.params.id } } },
      { new: true }
    );

    res.status(200).json({
      message: "Address has been deleted successfully",
      data: userData.addresses,
    });
  });
}

module.exports = Address;
