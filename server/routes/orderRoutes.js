const router = require("express").Router();
const {
  placeOrder,
  getOrderHistory,
  getOrderStatus,
  updateOrderStatus,
} = require("../controllers/orderController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post("/", auth, placeOrder);
router.get("/history", auth, getOrderHistory);
router.get("/:id/status", auth, getOrderStatus);

router.put("/:id/status", auth, role("admin"), updateOrderStatus);

module.exports = router;
