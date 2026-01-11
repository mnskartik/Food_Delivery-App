const router = require("express").Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// 🔐 Admin only
router.get("/orders", auth, role("admin"), async (req, res) => {
  const { status } = req.query;

  const filter = status ? { status } : {};

  const orders = await Order.find(filter)
    .populate("user", "name email")
    .populate("items.menuItem", "name price")
    .sort({ createdAt: -1 });

  res.json(orders);
});

// 🔍 Admin order details
router.get("/orders/:id", auth, role("admin"), async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.menuItem");

  if (!order) return res.status(404).json({ msg: "Order not found" });

  res.json(order);
});

module.exports = router;
