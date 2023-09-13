const router = require("express").Router();

const {
  addAddressToUserValidator,
  updateAddressValidator,
  removeAddressFromUserAddressesValidator,
} = require("../helpers/validators/address.validators");
const {
  addAdressToUser,
  getUserAddresses,
  updateAddress,
  removeAddressFromUserAddresses,
} = require("../controllers/address.controllers");
const Auth = require("../controllers/auth.controllers");

router.use(Auth.authorize, Auth.isAllowed("user"));

router
  .route("/")
  .post(addAddressToUserValidator, addAdressToUser)
  .get(getUserAddresses);

router
  .route("/:id")
  .put(updateAddressValidator, updateAddress)
  .delete(
    removeAddressFromUserAddressesValidator,
    removeAddressFromUserAddresses
  );

module.exports = router;
