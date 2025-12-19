const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },
        quantity: Number,
      },
    ],
    total: Number,
    status: {
      type: String,
      default: "pending", // pending | preparing | out_for_delivery | completed
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
