const router = require("express").Router();
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  updateUserPasswordValidator,
  deleteUserValidator,
} = require("../helpers/validators/user.validators");
const {
  addUser,
  getUser,
  getUsers,
  updateUser,
  updateUserPassword,
  deleteUser,
  getMe,
  uploadUserImage,
  resizeOptions,
  destroyImage,
} = require("../controllers/user.controllers");

const Auth = require("../controllers/auth.controllers");

router.get("/profile", Auth.authorize, getMe, getUser);

router
  .route("/")
  .post(
    Auth.authorize,
    Auth.isAllowed("SuperAdmin"),
    uploadUserImage,
    createUserValidator,
    resizeOptions,
    addUser
  )
  .get(Auth.authorize, Auth.isAllowed("SuperAdmin"), getUsers);

router.put(
  "/changepassword/:id",
  Auth.authorize,
  updateUserPasswordValidator,
  updateUserPassword
);

router
  .route("/:id")
  .get(Auth.authorize, Auth.isAllowed("SuperAdmin"), getUserValidator, getUser)
  .put(
    Auth.authorize,
    uploadUserImage,
    updateUserValidator,
    destroyImage,
    resizeOptions,
    updateUser
  )
  .delete(Auth.authorize, deleteUserValidator, destroyImage, deleteUser);

module.exports = router;
