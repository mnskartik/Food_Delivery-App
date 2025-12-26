const router = require("express").Router();
const {
  placeOrder,
  getOrderHistory,
  getOrderStatus,
  updateOrderStatus,
   getOrderDetails,
  cancelOrder,
} = require("../controllers/orderController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post("/", auth, placeOrder);
router.get("/history", auth, getOrderHistory);
router.get("/:id/status", auth, getOrderStatus);

router.put("/:id/status", auth, role("admin"), updateOrderStatus);

router.get("/:id", auth, getOrderDetails);
router.delete("/:id", auth, cancelOrder);

module.exports = router;
