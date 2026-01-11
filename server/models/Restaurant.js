const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: String,
    rating: { type: Number, default: 4 },
    deliveryTime: String, // "25–35 mins"
    distance: Number, // km (used for filters)
    isVeg: { type: Boolean, default: false },
    categories: [String], // ["Pizza", "Cafe"]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
