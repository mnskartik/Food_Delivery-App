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

router.post("/reorder/:id", auth, async (req, res) => {
  const oldOrder = await Order.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!oldOrder) return res.status(404).json({ msg: "Order not found" });

  const newOrder = await Order.create({
    user: req.user.id,
    items: oldOrder.items,
    total: oldOrder.total,
    status: "pending",
  });

  res.json(newOrder);
});


module.exports = router;
