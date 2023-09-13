const router = require("express").Router();

const {
  createCashOrder,
  filterOrdersByUser,
  getAllOrders,
  getSpecificOrder,
  updateSpecificOrderToPaid,
  updateSpecificOrderToDelivered,
  stripeSession,
} = require("../controllers/order.controllers");
const Auth = require("../controllers/auth.controllers");

router.use(Auth.authorize);

// Payments Gateway

router.post("/stripe/:cartId", Auth.isAllowed("user"), stripeSession);

// Cash Routes
router.route("/:cartId").post(Auth.isAllowed("user"), createCashOrder);

router.get(
  "/",
  Auth.isAllowed("user", "admin", "SuperAdmin"),
  filterOrdersByUser,
  getAllOrders
);

router.get(
  "/:id",
  Auth.isAllowed("user", "admin", "SuperAdmin"),
  getSpecificOrder
);

router.use(Auth.isAllowed("admin", "SuperAdmin"));

router.put("/:id/pay", updateSpecificOrderToPaid);
router.put("/:id/deliver", updateSpecificOrderToDelivered);
module.exports = router;
