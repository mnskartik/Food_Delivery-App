const Order = require("../models/Order");

exports.placeOrder = async (req, res) => {
  try {
    const order = await Order.create({
      user: req.user.id,
      items: req.body.items,
      total: req.body.total,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Order failed" });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json({ status: order.status });
  } catch {
    res.status(404).json({ message: "Order not found" });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "preparing",
      "out_for_delivery",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json({
      msg: "Order status updated",
      order,
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update status" });
  }
};

